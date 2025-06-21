# Login Component Usage

This Login component provides Internet Identity authentication for your ICP application.

## Basic Usage

### Option 1: Use the full LoginComponent with UI

```jsx
import { LoginComponent } from './components/Login';

function MyApp() {
  const handleAuthChange = (authState) => {
    console.log('Authentication state:', authState);
    // authState contains: { isAuthenticated, actor, principal }
  };

  return (
    <div>
      <LoginComponent 
        onAuthChange={handleAuthChange}
        showPrincipal={true} // Optional: shows principal ID
      />
    </div>
  );
}
```

### Option 2: Use the useAuth hook for custom implementation

```jsx
import { useAuth } from './components/Login';

function MyCustomLogin() {
  const auth = useAuth({
    onAuthChange: (authState) => {
      console.log('Auth changed:', authState);
    }
  });

  return (
    <div>
      <auth.AuthButton />
      {auth.isAuthenticated && (
        <div>
          <auth.WhoamiButton />
          <p>Principal: {auth.principal}</p>
        </div>
      )}
    </div>
  );
}
```

### Option 3: Individual Button Components

```jsx
import { useAuth } from './components/Login';

function MyApp() {
  const auth = useAuth();

  return (
    <div>
      {!auth.isAuthenticated ? (
        <auth.LoginButton />
      ) : (
        <>
          <auth.LogoutButton />
          <auth.WhoamiButton />
        </>
      )}
    </div>
  );
}
```

## Available Properties and Methods

### Authentication State
- `isAuthenticated`: Boolean indicating if user is logged in
- `principal`: String containing the user's principal ID
- `actor`: Authenticated actor instance for backend calls
- `loading`: Boolean indicating if auth operation is in progress

### Methods
- `login()`: Initiates Internet Identity login
- `logout()`: Logs out the user
- `whoami()`: Fetches and displays the current principal ID

### Button Components
- `AuthButton`: Toggle button (Login/Logout based on state)
- `LoginButton`: Login button only
- `LogoutButton`: Logout button only
- `WhoamiButton`: Button to fetch principal ID

## Example: Using authenticated actor for backend calls

```jsx
import { useAuth } from './components/Login';
import { ic_swipe_backend } from 'declarations/ic_swipe_backend';

function MyApp() {
  const auth = useAuth();

  const callBackend = async () => {
    // Use authenticated actor if available, fallback to default
    const actor = auth.actor || ic_swipe_backend;
    
    try {
      const result = await actor.greet("World");
      console.log(result);
    } catch (error) {
      console.error('Backend call failed:', error);
    }
  };

  return (
    <div>
      <auth.AuthButton />
      <button onClick={callBackend}>
        Call Backend
      </button>
    </div>
  );
}
```

## Styling

The component comes with built-in SCSS styling. You can override the styles by targeting these classes:

- `.login-component`: Main container
- `.auth-section`: Authentication section
- `.login-btn`: Base button style
- `.auth-button.login`: Login button
- `.auth-button.logout`: Logout button
- `.principal-display`: Principal ID display area 