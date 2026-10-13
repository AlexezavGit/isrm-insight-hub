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
- Agent integrations (MCP) at /mcp require OAuth sign-in (managed Cloud Auth) and return only anonymised guest data via buildPublicExperts — callers must be identified; private fields never leave the app.
- App shell architecture: the network graph is the persistent home surface; Search and member Cabinet are overlays controlled from bottom navigation, while War Room opens World Monitor externally — keeps the graph visible during primary workflows.
- Demo operational workflows remain browser-local mock state until shared authenticated storage is explicitly commissioned — prevents implying production persistence.
