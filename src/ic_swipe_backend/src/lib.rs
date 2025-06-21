use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::caller;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap, Storable};
use std::borrow::Cow;
use std::cell::RefCell;
use std::collections::HashMap;

// Memory management for stable storage
type Memory = VirtualMemory<DefaultMemoryImpl>;
type UserDataMap = StableBTreeMap<Principal, UserData, Memory>;
type UserTokenBalancesMap = StableBTreeMap<String, u64, Memory>; // Use composite key as String

thread_local! {
    // Memory manager for stable storage
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Stable storage for user data
    static USER_DATA: RefCell<UserDataMap> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0)))
        )
    );

    // Stable storage for user token balances (Principal, TokenId) -> Balance
    static USER_TOKEN_BALANCES: RefCell<UserTokenBalancesMap> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1)))
        )
    );
}

// User data structure
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct UserData {
    pub default_swap_amount: u64,
    pub icp_balance: u64,
    pub total_deposits: u64,
    pub total_swaps: u64,
}

impl Default for UserData {
    fn default() -> Self {
        Self {
            default_swap_amount: 0,
            icp_balance: 0,
            total_deposits: 0,
            total_swaps: 0,
        }
    }
}

// Implement Storable for UserData to work with stable storage
impl Storable for UserData {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(candid::encode_one(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        candid::decode_one(&bytes).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

// User portfolio structure for returning token balances
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct UserPortfolio {
    pub icp_balance: u64,
    pub default_swap_amount: u64,
    pub token_balances: Vec<(String, u64)>, // Changed from HashMap to Vec for Candid compatibility
    pub total_deposits: u64,
    pub total_swaps: u64,
}

// Transaction result structure
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct TransactionResult {
    pub success: bool,
    pub message: String,
    pub new_icp_balance: u64,
    pub new_token_balance: Option<u64>,
}

// Error types
#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum SwipeError {
    InsufficientBalance,
    InvalidAmount,
    TokenNotFound,
    UserNotFound,
}

// Helper function to get or create user data
fn get_or_create_user_data(principal: Principal) -> UserData {
    USER_DATA.with(|user_data| {
        let user_data_map = user_data.borrow();
        user_data_map.get(&principal).unwrap_or_default()
    })
}

// Helper function to update user data
fn update_user_data(principal: Principal, data: UserData) {
    USER_DATA.with(|user_data| {
        user_data.borrow_mut().insert(principal, data);
    });
}

// Helper function to get user token balance
fn get_user_token_balance(principal: Principal, token_id: &str) -> u64 {
    let composite_key = format!("{}:{}", principal.to_text(), token_id);
    USER_TOKEN_BALANCES.with(|balances| {
        let balances_map = balances.borrow();
        balances_map.get(&composite_key).unwrap_or(0)
    })
}

// Helper function to update user token balance
fn update_user_token_balance(principal: Principal, token_id: &str, balance: u64) {
    let composite_key = format!("{}:{}", principal.to_text(), token_id);
    USER_TOKEN_BALANCES.with(|balances| {
        let mut balances_map = balances.borrow_mut();
        if balance > 0 {
            balances_map.insert(composite_key, balance);
        } else {
            balances_map.remove(&composite_key);
        }
    });
}

// Helper function to get all user token balances
fn get_all_user_token_balances(principal: Principal) -> HashMap<String, u64> {
    let principal_prefix = format!("{}:", principal.to_text());
    USER_TOKEN_BALANCES.with(|balances| {
        let balances_map = balances.borrow();
        let mut user_tokens = HashMap::new();
        
        for (composite_key, balance) in balances_map.iter() {
            if composite_key.starts_with(&principal_prefix) {
                if let Some(token_id) = composite_key.strip_prefix(&principal_prefix) {
                    user_tokens.insert(token_id.to_string(), balance);
                }
            }
        }
        
        user_tokens
    })
}

// Public functions

/// Set the user's default ICP swap amount
#[ic_cdk::update]
pub fn set_default_swap_amount(amount: u64) -> u64 {
    let caller = caller();
    let mut user_data = get_or_create_user_data(caller);
    user_data.default_swap_amount = amount;
    update_user_data(caller, user_data);
    amount
}

/// Get the user's default ICP swap amount
#[ic_cdk::query]
pub fn get_default_swap_amount() -> u64 {
    let caller = caller();
    let user_data = get_or_create_user_data(caller);
    user_data.default_swap_amount
}

/// Register an ICP deposit for the user
#[ic_cdk::update]
pub fn deposit_icp(amount: u64) -> TransactionResult {
    if amount == 0 {
        return TransactionResult {
            success: false,
            message: "Deposit amount must be greater than 0".to_string(),
            new_icp_balance: 0,
            new_token_balance: None,
        };
    }

    let caller = caller();
    let mut user_data = get_or_create_user_data(caller);
    user_data.icp_balance += amount;
    user_data.total_deposits += amount;
    update_user_data(caller, user_data.clone());

    TransactionResult {
        success: true,
        message: format!("Successfully deposited {} ICP", amount),
        new_icp_balance: user_data.icp_balance,
        new_token_balance: None,
    }
}

/// Get the user's ICP balance
#[ic_cdk::query]
pub fn get_user_icp_balance() -> u64 {
    let caller = caller();
    let user_data = get_or_create_user_data(caller);
    user_data.icp_balance
}

/// Swap ICP to tokens
#[ic_cdk::update]
pub fn swap_icp_to_token(token_id: String, amount: u64) -> TransactionResult {
    if amount == 0 {
        return TransactionResult {
            success: false,
            message: "Swap amount must be greater than 0".to_string(),
            new_icp_balance: 0,
            new_token_balance: None,
        };
    }

    let caller = caller();
    let mut user_data = get_or_create_user_data(caller);

    // Check if user has sufficient ICP balance
    if user_data.icp_balance < amount {
        return TransactionResult {
            success: false,
            message: format!("Insufficient ICP balance. Available: {}, Required: {}", 
                           user_data.icp_balance, amount),
            new_icp_balance: user_data.icp_balance,
            new_token_balance: None,
        };
    }

    // Deduct ICP and add tokens (1:1 ratio for simplicity)
    user_data.icp_balance -= amount;
    user_data.total_swaps += amount;
    
    let current_token_balance = get_user_token_balance(caller, &token_id);
    let new_token_balance = current_token_balance + amount;
    
    update_user_data(caller, user_data.clone());
    update_user_token_balance(caller, &token_id, new_token_balance);

    TransactionResult {
        success: true,
        message: format!("Successfully swapped {} ICP to {} {} tokens", 
                        amount, amount, token_id),
        new_icp_balance: user_data.icp_balance,
        new_token_balance: Some(new_token_balance),
    }
}

/// Swap tokens back to ICP
#[ic_cdk::update]
pub fn swap_token_to_icp(token_id: String, amount: u64) -> TransactionResult {
    if amount == 0 {
        return TransactionResult {
            success: false,
            message: "Swap amount must be greater than 0".to_string(),
            new_icp_balance: 0,
            new_token_balance: None,
        };
    }

    let caller = caller();
    let current_token_balance = get_user_token_balance(caller, &token_id);

    // Check if user has sufficient token balance
    if current_token_balance < amount {
        return TransactionResult {
            success: false,
            message: format!("Insufficient {} token balance. Available: {}, Required: {}", 
                           token_id, current_token_balance, amount),
            new_icp_balance: 0,
            new_token_balance: Some(current_token_balance),
        };
    }

    // Deduct tokens and add ICP (1:1 ratio for simplicity)
    let mut user_data = get_or_create_user_data(caller);
    user_data.icp_balance += amount;
    
    let new_token_balance = current_token_balance - amount;
    
    update_user_data(caller, user_data.clone());
    update_user_token_balance(caller, &token_id, new_token_balance);

    TransactionResult {
        success: true,
        message: format!("Successfully swapped {} {} tokens to {} ICP", 
                        amount, token_id, amount),
        new_icp_balance: user_data.icp_balance,
        new_token_balance: Some(new_token_balance),
    }
}

/// Get user's complete portfolio
#[ic_cdk::query]
pub fn get_user_portfolio() -> UserPortfolio {
    let caller = caller();
    let user_data = get_or_create_user_data(caller);
    let token_balances_map = get_all_user_token_balances(caller);
    
    // Convert HashMap to Vec<(String, u64)> for Candid compatibility
    let token_balances: Vec<(String, u64)> = token_balances_map.into_iter().collect();

    UserPortfolio {
        icp_balance: user_data.icp_balance,
        default_swap_amount: user_data.default_swap_amount,
        token_balances,
        total_deposits: user_data.total_deposits,
        total_swaps: user_data.total_swaps,
    }
}

/// Get user's token balance for a specific token
#[ic_cdk::query]
pub fn get_token_balance(token_id: String) -> u64 {
    let caller = caller();
    get_user_token_balance(caller, &token_id)
}

/// Get all users' data (admin function for debugging)
#[ic_cdk::query]
pub fn get_all_users_count() -> u64 {
    USER_DATA.with(|user_data| {
        user_data.borrow().len()
    })
}

/// Get caller's principal (for debugging)
#[ic_cdk::query]
pub fn whoami() -> String {
    caller().to_text()
}

/// Legacy greet function for backward compatibility
#[ic_cdk::query]
pub fn greet(name: String) -> String {
    let caller = caller();
    let user_data = get_or_create_user_data(caller);
    format!("Hello, {}! Your ICP balance: {} ICP, Default swap amount: {} ICP", 
            name, user_data.icp_balance, user_data.default_swap_amount)
}

// Export candid interface
ic_cdk::export_candid!();
