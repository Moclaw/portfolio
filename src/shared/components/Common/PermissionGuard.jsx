import React from 'react';
import { useAuth } from '../../context/AuthContext';

const PermissionGuard = ({ 
  resource, 
  action, 
  permissions, 
  children, 
  fallback = null,
  requireAll = false,
  disableInsteadOfHide = false // New prop to disable instead of hiding
}) => {
  const { hasPermission, hasAnyPermission, user } = useAuth();

  let hasRequiredPermissions = true;

  // Check single permission
  if (resource && action) {
    hasRequiredPermissions = hasPermission(resource, action);
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    hasRequiredPermissions = requireAll 
      ? permissions.every(permission => {
          const [res, act] = permission.split(':');
          return hasPermission(res, act);
        })
      : hasAnyPermission(permissions);
  }

  // If no permission and not using disable mode, return fallback or null
  if (!hasRequiredPermissions && !disableInsteadOfHide) {
    return fallback;
  }

  // If using disable mode and user doesn't have permission, disable the element
  if (!hasRequiredPermissions && disableInsteadOfHide) {
    // Clone children and add disabled props
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          disabled: true,
          style: { 
            ...child.props.style, 
            opacity: 0.5, 
            pointerEvents: 'none',
            cursor: 'not-allowed'
          },
          onClick: undefined,
          onSubmit: undefined,
          title: `${child.props.title || ''} (Read-only access)`.trim()
        });
      }
      return child;
    });
  }

  return children;
};

export default PermissionGuard;
