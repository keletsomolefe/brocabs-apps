# Context

We need to implement an **SOS Contacts** feature for both Rider and Driver apps. This feature allows users to save emergency contacts (Name, Phone Number, Relationship) to their **profile** (rider or driver profile, not user).

**Tech Stack:** NestJS, TypeORM, Zod, TanStack Query, Expo.

# Task 1: Backend Implementation (`apps/api`)

Create a new module `sos-contacts` in `apps/api/src/sos-contacts/` with the following:

1.  **Entity (`sos-contact.entity.ts`)**:
    - Columns: `id` (uuid), `name` (string), `phoneNumber` (string), `relation` (string, optional).
    - Profile association: `profileId` (uuid) and `profileType` (varchar, "rider" or "driver") — uses the same pattern as wallets.
    - Timestamps: `createdAt`, `updatedAt`.
    - Add `@Check` constraint for `profileType` and `@Index` on `[profileId, profileType]`.

2.  **DTOs (`dto/`)**:
    - Use `nestjs-zod`'s `createZodDto`.
    - `CreateSosContactDto`: Validates name (min 2 chars), phoneNumber (valid phone format).
    - `SosContactResponseDto`: Response shape including `profileId` and `profileType`.

3.  **Service (`sos-contacts.service.ts`)**:
    - Define `ProfileContext` interface with `profileId` and `profileType`.
    - All methods accept `ProfileContext` to scope operations to the current profile.
    - Limit to max 5 SOS contacts per profile.

4.  **Controller (`sos-contacts.controller.ts`)**:
    - `POST /sos-contacts`: Add a new contact (Limit to max 5 per profile).
    - `GET /sos-contacts`: List profile's contacts.
    - `DELETE /sos-contacts/:id`: Remove a contact.
    - Use `@UseGuards(RolesGuard)` and extract profile context from `req.driverProfile` or `req.riderProfile` based on `req.applicationType`.
    - Add `@ApiTags('SOS Contacts')` for Swagger.

5.  **Registration**:
    - Update `apps/api/src/app.module.ts` to import `SosContactsModule` and add `SosContact` to the TypeORM entities list.

6.  **Database Migration**:
    - Generate and run the migration for the new entity. Run these commands from the `apps/api` directory:
      ```bash
      cd apps/api
      pnpm migration:generate src/database/migrations/CreateSosContacts
      pnpm migration:run
      ```

# Task 2: Client & Frontend Integration

After backend changes and migrations are applied:

1.  **Regenerate Client**:
    - From the project root, run specific formatting and generation commands to update the OpenAPI spec and the `@brocabs/client` package:
      ```bash
      pnpm generate:api
      ```

2.  **Update Query Keys**:
    - Edit `packages/client/src/constants.ts` and add `SOS_CONTACTS = "sos-contacts"` to the `QueryKeys` enum.

3.  **Create Hooks (`apps/driver/src/hooks/use-sos-contacts.ts` & Rider equiv)**:
    - `useSosContacts()`: A `useQuery` hook fetching `api.sosContactsControllerFindAll()`. Use the new QueryKey.
    - `useAddSosContact()`: A `useMutation` hook calling `create`. On success, invalidate `SOS_CONTACTS`.
    - `useRemoveSosContact()`: A `useMutation` hook calling `remove`. On success, invalidate `SOS_CONTACTS`.

4.  **UI Integration Guidelines**:
    - Create a reusable component `SosContactList` that uses `useSosContacts`.
    - Implement a form or modal using `useAddSosContact` with validation feedback.
    - Note: SOS contacts are profile-specific, so a user with both rider and driver profiles will have separate SOS contacts for each.
