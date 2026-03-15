import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw Route.redirect({
      to: '/rooms',
      replace: true,
      statusCode: 301 // Permanent redirect
    });
  }
});
