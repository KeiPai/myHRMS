// @generated from auth/v1/auth.proto (package auth.v1)
// Embedded in remote app - sync with packages/grpc-contracts when proto changes

import type { FieldList, PartialMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

export class ExchangeTokenRequest extends Message<ExchangeTokenRequest> {
  token = "";
  tokenTypeHint = "";

  constructor(data?: PartialMessage<ExchangeTokenRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "auth.v1.ExchangeTokenRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "token", kind: "scalar", T: 9 },
    { no: 2, name: "token_type_hint", kind: "scalar", T: 9 },
  ]);
}

export class ExchangeTokenResponse extends Message<ExchangeTokenResponse> {
  accessToken = "";
  tokenType = "";
  expiresIn = 0;

  constructor(data?: PartialMessage<ExchangeTokenResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "auth.v1.ExchangeTokenResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "access_token", kind: "scalar", T: 9 },
    { no: 2, name: "token_type", kind: "scalar", T: 9 },
    { no: 3, name: "expires_in", kind: "scalar", T: 5 },
  ]);
}

export class VerifyTokenRequest extends Message<VerifyTokenRequest> {
  token = "";

  constructor(data?: PartialMessage<VerifyTokenRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "auth.v1.VerifyTokenRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "token", kind: "scalar", T: 9 },
  ]);
}

export class VerifyTokenResponse extends Message<VerifyTokenResponse> {
  userId = "";
  email = "";
  organizationId = "";
  roles: string[] = [];

  constructor(data?: PartialMessage<VerifyTokenResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "auth.v1.VerifyTokenResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "user_id", kind: "scalar", T: 9 },
    { no: 2, name: "email", kind: "scalar", T: 9 },
    { no: 3, name: "organization_id", kind: "scalar", T: 9 },
    { no: 4, name: "roles", kind: "scalar", T: 9, repeated: true },
  ]);
}
