<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shared hotel data, image references, pricing calculations, and contact details centralized in `src/lib/hotel.ts` so every route stays consistent.
- Keep global navigation, footer, image fallback, and shared page presentation in `src/components/site.tsx` to preserve one visual language across the multi-page site.
