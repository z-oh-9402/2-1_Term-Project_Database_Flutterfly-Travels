import { apiFetch } from './api';

// Wishlist calls for destinations, accommodations and restaurants (the backend uses the logged-in customer's id)
const ID_FIELDS = {
    destination: 'destination_id',
    accommodation: 'accommodation_id',
    restaurant: 'restaurant_id',
};

const WISHLIST_CHANGED = 'wishlist-changed';

export const wishlistItemId = (itemType, item) => item[ID_FIELDS[itemType]];

export const isInWishlist = async (itemType, itemId) => {
    const response = await apiFetch(`http://localhost:3000/wishlist/${itemType}?itemId=${itemId}`, {
        method: "GET",
    });
    return response.ok ? await response.json() : false;
}

// Adds (add = true) or removes the item, then tells the rest of the app. Throws if the request fails.
export const setInWishlist = async (itemType, itemId, add) => {
    const response = await apiFetch(`http://localhost:3000/wishlist/${itemType}`, {
        method: add ? "POST" : "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId }),
    });
    if (!response.ok) {
        throw new Error("Could not update the wishlist");
    }
    window.dispatchEvent(new CustomEvent(WISHLIST_CHANGED, { detail: { itemType, itemId, inWishlist: add } }));
}

// Calls callback({ itemType, itemId, inWishlist }) whenever the wishlist changes anywhere in the app,
// so every heart on screen stays in sync. Returns a function that stops listening.
export const onWishlistChanged = (callback) => {
    const listener = (event) => callback(event.detail);
    window.addEventListener(WISHLIST_CHANGED, listener);
    return () => window.removeEventListener(WISHLIST_CHANGED, listener);
}
