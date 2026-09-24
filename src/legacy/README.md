# Backend-dependent pages

Search, store, checkout, cart, and administrator source files are retained here at the owner's request.
They are intentionally not imported by the archive router and have no navigation entries.
Do not delete them as unused archive code. Existing backend environment settings and axios are retained.

To restore these features, first restore and verify the API, then reconnect the original routes
and navigation from commit `54ea42e`. Local storage cart data is not removed by this cleanup.
