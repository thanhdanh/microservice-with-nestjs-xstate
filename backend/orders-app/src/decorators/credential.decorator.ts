import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ICredential } from '../auth/constants';

export const Credential = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return <ICredential> request.user;
    },
);