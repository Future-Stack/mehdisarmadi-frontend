# Redux Setup for API Integration

## Overview

Redux is now configured with **async thunks** for API integration. This setup provides a centralized state management system for handling API calls with automatic loading, error, and success states.

## Architecture

```
store/
├── index.ts              # Store configuration
├── hooks.ts              # Custom hooks for easy access
├── slices/
│   ├── authSlice.ts      # Auth state & reducers
│   ├── authThunks.ts     # Auth async thunks
│   ├── usersSlice.ts     # Users state & reducers
│   ├── usersThunks.ts    # Users async thunks
│   ├── projectsSlice.ts  # Projects state & reducers
│   ├── projectsThunks.ts # Projects async thunks
│   └── uiSlice.ts        # UI state
```

## Available Modules

### 1. **Authentication**
Handles login, register, logout, and token refresh.

**Actions:**
- `loginThunk` - Login user
- `registerThunk` - Register new user
- `logoutThunk` - Logout user
- `refreshTokenThunk` - Refresh access token

**State:**
```typescript
auth: {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

**Usage in Components:**
```tsx
"use client";
import { useAuthActions, useAuthState } from "@/store/hooks";

export default function LoginPage() {
  const { login } = useAuthActions();
  const { isLoading, error, isAuthenticated } = useAuthState();

  const handleLogin = async () => {
    const result = await login("user@example.com", "password");
    console.log(result);
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

---

### 2. **Users Management**
Handles fetching, selecting, and deleting users.

**Actions:**
- `fetchUsersThunk` - Get all users
- `fetchUserByIdThunk` - Get single user
- `deleteUserThunk` - Delete user

**State:**
```typescript
users: {
  users: User[]
  selectedUser: User | null
  isLoading: boolean
  error: string | null
  totalCount: number
}
```

**Usage in Components:**
```tsx
"use client";
import { useUsersActions, useUsersState } from "@/store/hooks";
import { useEffect } from "react";

export default function UsersPage() {
  const { fetchUsers, deleteUser } = useUsersActions();
  const { users, isLoading, error } = useUsersState();

  useEffect(() => {
    fetchUsers(1, 10); // page, limit
  }, []);

  const handleDelete = async (userId: string) => {
    await deleteUser(userId);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

### 3. **Projects Management**
Handles fetching, creating, updating, and deleting projects.

**Actions:**
- `fetchProjectsThunk` - Get all projects
- `fetchProjectByIdThunk` - Get single project
- `createProjectThunk` - Create project
- `updateProjectThunk` - Update project
- `deleteProjectThunk` - Delete project

**State:**
```typescript
projects: {
  projects: Project[]
  selectedProject: Project | null
  isLoading: boolean
  error: string | null
}
```

**Usage in Components:**
```tsx
"use client";
import { useProjectsActions, useProjectsState } from "@/store/hooks";
import { useEffect } from "react";

export default function ProjectsPage() {
  const { fetchProjects, createProject, updateProject, deleteProject } = useProjectsActions();
  const { projects, isLoading, error, selectedProject } = useProjectsState();

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    await createProject("New Project", "Description");
  };

  const handleUpdate = async (projectId: string) => {
    await updateProject(projectId, {
      name: "Updated Name",
      status: "completed",
    });
  };

  const handleDelete = async (projectId: string) => {
    await deleteProject(projectId);
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={isLoading}>
        Create Project
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <button onClick={() => handleUpdate(project.id)}>Update</button>
          <button onClick={() => handleDelete(project.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## How to Add More API Integrations

### Step 1: Create Thunks File
Create `src/store/slices/[feature]Thunks.ts`:

```typescript
import { createAsyncThunk } from "@reduxjs/toolkit";
import { featureService } from "@/services/feature.service";

export const fetchFeatureThunk = createAsyncThunk<
  FeatureType[],
  void,
  { rejectValue: string }
>("feature/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await featureService.getAll();
    if (!response.success) {
      return rejectWithValue(response.message || "Failed");
    }
    return response.data || [];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed"
    );
  }
});
```

### Step 2: Create Slice
Create `src/store/slices/[feature]Slice.ts`:

```typescript
import { createSlice } from "@reduxjs/toolkit";
import { fetchFeatureThunk } from "./featureThunks";

interface FeatureState {
  items: FeatureType[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  items: [],
  isLoading: false,
  error: null,
};

const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatureThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeatureThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchFeatureThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed";
      });
  },
});

export const { clearError } = featureSlice.actions;
export default featureSlice.reducer;
```

### Step 3: Register in Store
Update `src/store/index.ts`:

```typescript
import featureReducer from "./slices/featureSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    users: usersReducer,
    projects: projectsReducer,
    feature: featureReducer, // Add here
  },
});
```

### Step 4: Add Hooks
Update `src/store/hooks.ts`:

```typescript
export const useFeatureActions = () => {
  const dispatch = useAppDispatch();
  return {
    fetchFeature: () => dispatch(fetchFeatureThunk()),
  };
};

export const useFeatureState = () =>
  useAppSelector((state) => ({
    items: state.feature.items,
    isLoading: state.feature.isLoading,
    error: state.feature.error,
  }));
```

---

## Best Practices

1. **Always handle loading states** - Show spinners/skeletons during API calls
2. **Catch and display errors** - Users should see meaningful error messages
3. **Use typed hooks** - Use custom hooks for better type safety
4. **Keep services separate** - API logic stays in `services/`, Redux handles state
5. **Clear errors when needed** - Use `clearError` action to reset error state
6. **Validate responses** - Check `response.success` before accessing `response.data`

## Testing Redux Hooks

```tsx
// In your component test
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/store";
import MyComponent from "@/components/MyComponent";

test("renders with Redux state", () => {
  render(
    <Provider store={store}>
      <MyComponent />
    </Provider>
  );
  expect(screen.getByText(/expected text/i)).toBeInTheDocument();
});
```

---

## Debugging

Redux DevTools is enabled in development. Open Redux DevTools browser extension to:
- See all dispatched actions
- Time-travel debug through states
- View state changes in real-time
