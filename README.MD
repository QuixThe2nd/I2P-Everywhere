This is a proposed implementation of an i2p-location header, similar to [onion-location](https://community.torproject.org/onion-services/advanced/onion-location/)

This extension is compatible with Chrome and Firefox, and redirects sites with an i2p-location header or meta tag to their respective I2P sites. Please note, this is not an adopted format at all, and at the time of writing this will only work on my sites. If other sites choose to implement this header/meta-tag, they are free to do so.

This does _not_ provide good privacy guarantees; but instead:

-   Normalizes I2P usage, so it is less of an oddity for anyone looking at network traffic
-   Makes hidden eepsites available in your regular browser

Based off https://github.com/QuixThe2nd/onion-everywhere which was forked from https://github.com/daurnimator/onion-everywhere which was inspired by https://gitlab.com/sanpi/onion-everywhere
