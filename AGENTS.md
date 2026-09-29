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

- Weather UI is organized into pages, reusable weather components, typed mock data, and replaceable service adapters so live feeds can be added without rebuilding the interface.
- Forecast, map layers, playback, alert status, and browser-saved preferences share one client-side weather provider so controls stay synchronized across routes.
- Overview, Live Map, and Storm Simulation share one Leaflet adapter; synthetic storm physics and forecasts remain in the simulation service so live feeds can replace them without changing map interactions.
