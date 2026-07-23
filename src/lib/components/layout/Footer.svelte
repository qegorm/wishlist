<script lang="ts">
	import { links } from '$lib/constants'

	import Text from '$lib/components/typography/Text.svelte'

	interface FooterLink {
		name: string
		href: string
	}

	const footerLinks: FooterLink[] = [
		{
			name: 'Написать',
			href: links.telegram
		},
		{
			name: 'GitHub',
			href: links.github
		},
		{
			name: 'Код проекта',
			href: links.code
		}
	]
</script>

<footer class="footer">
	<div class="footer__start">
		<a href="https://egor.me" target="_blank" rel="noopener">
			<img src="/images/logos/me.svg" alt="Мой логотип" width={90} height={28} />
		</a>
		<Text as="p" variant="caption" color="subtle">2025–2026</Text>
	</div>
	{#each footerLinks as footerLink}
		<a href={footerLink.href} target="_blank" class="footer__link" rel="noopener noreferrer">
			<Text as="span" variant="bodySm">
				{footerLink.name}
			</Text>
		</a>
	{/each}
</footer>

<style lang="scss">
	.footer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		padding-block: 20px;
		border-top: 2px solid rgb(var(--color-separator));

		@media (max-width: 1024px) {
			padding-block: 16px;
		}

		&__start {
			display: flex;
			gap: 24px;
			align-items: center;

			@media (max-width: 640px) {
				justify-content: center;
				width: 100%;
				margin-block-end: 12px;
			}
		}

		&__link {
			padding: 6px 12px;
			color: rgb(var(--color-muted));

			@media (max-width: 640px) {
				width: 33%;
				padding-inline: 0;
				padding-block: 4px;
				text-align: center;
			}

			&:hover,
			&:focus-visible {
				color: rgb(var(--color-cream));
				text-decoration: var(--decoration-link);
			}
		}
	}
</style>
