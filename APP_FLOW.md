# Vitality App — Current User Flow

**Purpose:** Manager-ready overview of the app flow as currently implemented in the React Native client. This reflects the navigation and visible journeys in the codebase; it is not a product roadmap.

```mermaid
flowchart TD
    A[App launch] --> B[Restore saved session]
    B -->|Valid session| C[Main app]
    B -->|No session / restore fails| D[Login]
    D -->|Sign in| E[Email verification code]
    E -->|Verified| C
    D -->|Create account| F[Register]
    F --> G[Email verification code]
    G -->|Verified| C
    D -->|Forgot password| H[Request reset code]
    H --> I[Verify reset code]
    I --> J[Set new password]
    J --> D

    C --> T{Bottom navigation}
    T --> HOME[Home]
    T --> CH[Challenges]
    T --> GR[Groups]
    T --> DI[Discover]
    T --> PR[Profile]

    HOME --> H1[Daily activity details]
    HOME --> H2[Activity trends]
    HOME --> H3[Workout categories]
    H3 --> H4[Start workout session]
    H4 --> H5[Pause / resume / finish]
    H5 --> HOME
    HOME -->|Quick action| CH
    HOME -. Health data prompt .-> HC[Profile → Connected Devices]
    HC --> HC1[Connect device / grant Health Connect access]
    HC1 -. Optional .-> HC2[Enable background health sync in Settings]

    CH --> CH1[Challenges tab]
    CH --> CH2[Leaderboard tab]
    CH --> CH3[Badges tab]
    CH1 --> CH4[Browse all challenges]
    CH4 --> CH5[Filter / join or create step challenge]

    GR --> GR1[Feed / My Groups]
    GR --> GR2[Create group]
    GR1 --> GR3[Open group]
    GR3 --> GR4[Overview]
    GR3 --> GR5[Leaderboard]
    GR3 --> GR6[Group challenges]
    GR6 --> GR7[Create challenge]
    GR3 -. Chat UI present but currently not enabled in detail screen .-> GR8[Group chat]

    DI --> DI1[Browse recommended programs]
    DI1 --> DI2[Program details / start program]

    PR --> PR1[Edit profile]
    PR --> PR2[Settings]
    PR --> HC
    PR --> PR3[Rewards / points]
    PR --> PR4[Health reports]
    PR --> PR5[Privacy]
    PR --> PR6[Help & support]
    PR2 --> PR7[Units / appearance / health sync / location options]
    PR2 --> PR8[Change password / sign out]

    C --> N[Notifications]
    N --> C
    C -. Session expires .-> D
```

## Manager summary

- **Entry and account access:** the app restores a saved session on launch. New sign-ins and registrations use email verification; password recovery uses a separate reset-code flow.
- **Core app:** five tabs provide Home, Challenges, Groups, Discover, and Profile.
- **Health and activity:** Home summarizes activity and launches workouts, activity details, and trends. Device connection and Health Connect permissions are user-controlled from Profile; background sync is optional in Settings.
- **Engagement:** users can browse challenges, leaderboards and badges; create or open groups and view group overview, leaderboard and challenges; and browse recommended programs.
- **Account support:** Profile links to rewards, reports, privacy, settings, and help. Notifications are reachable from the app shell. An expired session returns the user to Login.

## Current implementation notes

- Onboarding screens exist in the source tree, but onboarding is not registered in the active root navigator; launch currently routes to Login or the restored main app.
- Google sign-in buttons are present in the UI, but the README states Google OAuth configuration is unavailable. Email/password is the active documented sign-in path.
- A program detail component and start-program interaction exist, but the Discover stack currently registers only the Discover screen; confirm its presentation path before treating it as a standalone navigation route.
- Group chat UI/service code exists, but the chat tab is commented out in the group detail screen and requires socket configuration.
