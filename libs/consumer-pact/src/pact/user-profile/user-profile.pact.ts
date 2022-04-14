import { HttpHeaderKey } from '@app/ui/shared/domain';
import {
  changePasswordTemplate,
  defaultTemplate,
  deleteProfileTemplate,
  updateProfilePreferencesTemplate,
  updateProfileTemplate,
  uploadAvatarTemplate,
} from '@app/ui/testing';
import { ContentType } from '@hal-form-client';
import { InteractionObject } from '@pact-foundation/pact';
import { HTTPMethod } from '@pact-foundation/pact/src/common/request';
import { pactCurrentUser } from '../../mocks/user.mock';
import { bearer } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';

export namespace GetUserProfilePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactCurrentUser.id }, authorities: ['profile:read'] })),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...pactCurrentUser },
    },
  };

  export const with_update: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile with update',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: pactCurrentUser.id },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactCurrentUser,
        userPreferences: {
          ...pactCurrentUser.userPreferences,
          _templates: {
            ...defaultTemplate,
            ...updateProfilePreferencesTemplate,
          },
        },
        _templates: {
          ...defaultTemplate,
          ...updateProfileTemplate,
          ...uploadAvatarTemplate,
          ...changePasswordTemplate,
        },
      },
    },
  };

  export const with_delete: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile with delete',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: pactCurrentUser.id },
            authorities: ['profile:read', 'profile:delete'],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: {
        ...pactCurrentUser,
        _templates: {
          ...defaultTemplate,
          ...deleteProfileTemplate,
        },
      },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactCurrentUser.id } })),
      },
    },
    willRespondWith: {
      status: 401,
      body: {
        reason: 'Unauthorized',
        title: 'Insufficient permissions',
      },
    },
  };

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile not found',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: 'notFoundId' }, authorities: ['profile:read'] })),
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'User with id: notFoundId not found',
      },
    },
  };
}

export namespace UpdateUserProfilePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: pactCurrentUser.id },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: { firstname: 'pactUserFirstname' },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...pactCurrentUser },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactCurrentUser.id } })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: { firstname: 'pactUserFirstname' },
    },
    willRespondWith: {
      status: 401,
      body: {
        reason: 'Unauthorized',
        title: 'Insufficient permissions',
      },
    },
  };

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: { firstname: 'pactUserFirstname' },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'User with id: notFoundId not found',
      },
    },
  };
}

export namespace UpdateUserProfilePasswordPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile password',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile/password',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: pactCurrentUser.id },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: { password: 'password', newPassword: 'newPassword' },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...pactCurrentUser },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile password unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile/password',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactCurrentUser.id } })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: { password: 'password', newPassword: 'newPassword' },
    },
    willRespondWith: {
      status: 401,
      body: {
        reason: 'Unauthorized',
        title: 'Insufficient permissions',
      },
    },
  };

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile password not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile/password',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: { password: 'password', newPassword: 'newPassword' },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'User with id: notFoundId not found',
      },
    },
  };
}

export namespace DeleteUserProfilePact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete user profile',
    withRequest: {
      method: HTTPMethod.DELETE,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: pactCurrentUser.id },
            authorities: ['profile:read', 'profile:delete'],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 204,
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete user profile unauthorized',
    withRequest: {
      method: HTTPMethod.DELETE,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactCurrentUser.id } })),
      },
    },
    willRespondWith: {
      status: 401,
      body: {
        reason: 'Unauthorized',
        title: 'Insufficient permissions',
      },
    },
  };

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'delete user profile not found',
    withRequest: {
      method: HTTPMethod.DELETE,
      path: '/api/user/profile',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read', 'profile:delete'],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'User with id: notFoundId not found',
      },
    },
  };
}

export namespace GetUserProfilePreferencesPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile preferences',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile/preferences',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: pactCurrentUser.id },
            authorities: ['profile:read'],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...pactCurrentUser.userPreferences },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile preferences unauthorized',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile/preferences',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactCurrentUser.id } })),
      },
    },
    willRespondWith: {
      status: 401,
      body: {
        reason: 'Unauthorized',
        title: 'Insufficient permissions',
      },
    },
  };

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'get user profile preferences not found',
    withRequest: {
      method: HTTPMethod.GET,
      path: '/api/user/profile/preferences',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read'],
          }),
        ),
      },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'User with id: notFoundId not found',
      },
    },
  };
}

export namespace UpdateUserProfilePreferencesPact {
  export const successful: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile preferences',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile/preferences',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: pactCurrentUser.id },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: { darkMode: true },
    },
    willRespondWith: {
      status: 200,
      headers: { [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON_HAL_FORMS },
      body: { ...pactCurrentUser.userPreferences },
    },
  };

  export const unauthorized: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile preferences unauthorized',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile/preferences',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(jwtToken({ user: { id: pactCurrentUser.id } })),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: { darkMode: true },
    },
    willRespondWith: {
      status: 401,
      body: {
        reason: 'Unauthorized',
        title: 'Insufficient permissions',
      },
    },
  };

  export const not_found: InteractionObject = {
    state: 'stateless',
    uponReceiving: 'update user profile preferences not found',
    withRequest: {
      method: HTTPMethod.PATCH,
      path: '/api/user/profile/preferences',
      headers: {
        Accept: ContentType.APPLICATION_JSON_HAL_FORMS,
        Authorization: bearer(
          jwtToken({
            user: { id: 'notFoundId' },
            authorities: ['profile:read', 'profile:update'],
          }),
        ),
        [HttpHeaderKey.CONTENT_TYPE]: ContentType.APPLICATION_JSON,
      },
      body: { darkMode: true },
    },
    willRespondWith: {
      status: 404,
      body: {
        reason: 'Not Found',
        title: 'User with id: notFoundId not found',
      },
    },
  };
}
