# gRPC Auth Contracts (embedded)

These files are **embedded** in each remote app to avoid external package references (e.g. `@venizia/grpc-contracts`), which can cause install issues on Windows.

**When to update:** If `protos/auth/v1/auth.proto` or `packages/grpc-contracts` changes, regenerate and copy:

```bash
cd packages/grpc-contracts && bun run generate
# Then copy src/gen/auth/v1/auth_pb.ts and auth_connect.ts here
```
