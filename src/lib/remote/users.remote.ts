import { z } from 'zod'

import { env } from '$env/dynamic/private'
import { query } from '$app/server'
import { db } from '$lib/server/db'
import { users } from '$lib/server/db/schema'

export const createUser = query(z.string().optional(), async (key) => {
	if (key !== env.WISHLIST_KEY) {
		throw new Error('Invalid key')
	}

	return db().insert(users).values({}).returning()
})

export const validateUser = query(z.string().optional(), async (key) => {
	return key === env.WISHLIST_KEY
})
