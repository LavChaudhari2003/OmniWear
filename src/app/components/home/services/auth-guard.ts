import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user/user';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.isUserAuhtenticated$.pipe(
    map((isAuthenticated) => {
      return isAuthenticated
        ? true
        : router.createUrlTree(['/home/login'], {
            queryParams: { returnUrl: state.url },
          });
    })
  );
};
