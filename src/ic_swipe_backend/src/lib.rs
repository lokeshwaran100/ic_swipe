use candid::{CandidType, Nat};
use ic_cdk::api::management_canister;

use std::cell::RefCell;

thread_local! {
    // Global state of the canister. Will be wiped when upgrading the canister.
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[derive(Debug, Default, Clone, CandidType)]
struct State {
    default_swap_amount: u64,
}

#[ic_cdk::update]
fn set_default_swap_amount(default_swap_amount: u64) -> u64 {
    STATE.with(|s| {
        let mut state = s.borrow_mut();
        state.default_swap_amount = default_swap_amount;
        state.default_swap_amount.clone()
    })
}

#[ic_cdk::query]
fn get_default_swap_amount() -> u64 {
    STATE.with(|s| {
        let state = s.borrow();
        state.default_swap_amount.clone()
    })
}
