import { z } from 'zod';

export const schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1)
});
