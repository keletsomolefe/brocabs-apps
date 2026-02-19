# Context

We need to implement a **Favorite Addresses** feature (e.g., "Home", "Work") for the **Rider app only**. Favorite addresses are stored per rider profile, not per user.

**Tech Stack:** NestJS, TypeORM, Zod, TanStack Query, Expo.

# Task 1: Backend Implementation (`apps/api`)

Create a new module `favorite-addresses` in `apps/api/src/favorite-addresses/` with the following:

1.  **Entity (`favorite-address.entity.ts`)**:
    - Columns: `id` (uuid), `label` (string, e.g., "Home"), `address` (string, full formatted address), `latitude` (decimal), `longitude` (decimal), `placeId` (string, optional Google Place ID).
    - Profile association: Many-to-One with `RiderProfile` entity (`riderProfileId`).
    - Add `@Index` on `riderProfileId` for query performance.
    - Timestamps: `createdAt`, `updatedAt`.

2.  **DTOs (`dto/`)**:
    - Use `nestjs-zod`.
    - `CreateFavoriteAddressDto`: Requires label, address, lat, lng.
    - `UpdateFavoriteAddressDto`: Partial update.

3.  **Controller (`favorite-addresses.controller.ts`)**:
    - `POST /favorite-addresses`: Save a location.
    - `GET /favorite-addresses`: List rider's favorites.
    - `DELETE /favorite-addresses/:id`: Remove a favorite.
    - Use `@UseGuards(RolesGuard)` authentication.
    - Extract `riderProfileId` from `req.riderProfile.id` (requires rider app context).
    - Add `@ApiTags('Favorite Addresses')`.

4.  **Registration**:
    - Update `apps/api/src/app.module.ts`: Import module and register entity in `TypeOrmModule`.

5.  **Database Migration**:
    - Generate and run the migration for the new entity. Run these commands from the `apps/api` directory:
      ```bash
      cd apps/api
      pnpm migration:generate src/database/migrations/CreateFavoriteAddresses
      pnpm migration:run
      ```

# Task 2: Client & Frontend Integration (Rider App Only)

After backend changes and migrations are applied:

1.  **Regenerate Client**:
    - From the project root, run specific formatting and generation commands to update the OpenAPI spec and the `@brocabs/client` package:
      ```bash
      pnpm generate:api
      ```

2.  **Update Query Keys**:
    - Edit `packages/client/src/constants.ts` and add `FAVORITE_ADDRESSES = "favorite-addresses"`.

3.  **Create Hooks (`apps/rider/src/hooks/use-favorite-addresses.ts`)**:
    - `useFavoriteAddresses()`: `useQuery` hook for fetching the list.
    - `useAddFavoriteAddress()`: `useMutation` hook connected to `create`. Invalidate `FAVORITE_ADDRESSES` on success.
    - `useRemoveFavoriteAddress()`: `useMutation` hook.

4.  **UI Integration Guidelines**:
    - Integrate with the existing map search or location selection flow.
    - Show "Saved Places" list using the query hook.
    - Note: Favorite addresses are rider profile-specific (not shared with driver profile if user has both).
