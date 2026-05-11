import { ShoppingCart, Check } from 'lucide-react';
import { useVisitedListings, recordVisit } from '../hooks/useVisitedListings';

/**
 * Small "Add to Cart" pill rendered inside listing cards.
 *
 * `entry` is the same shape `recordVisit` accepts:
 *   { id, type: 'land'|'plot', slug, listingNumber, title, location, price, img }
 *
 * Clicking toggles the entry in the visited / cart list (localStorage).
 * Stops propagation so the surrounding card <Link> isn't followed.
 */
function AddToCartButton({ entry, size = 'sm', className = '' }) {
  const { entries, remove } = useVisitedListings();
  const inCart = entries.some((e) => e.id === entry.id);

  const handleClick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (inCart) {
      remove(entry.id);
    } else {
      recordVisit(entry);
    }
  };

  return (
    <button
      type="button"
      className={[
        'btn-card-cart',
        size === 'lg' ? 'btn-card-cart--lg' : '',
        inCart ? 'is-added' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      aria-pressed={inCart}
      aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
      title={inCart ? 'Added to cart — click to remove' : 'Add to cart'}
    >
      {inCart ? <Check size={14} /> : <ShoppingCart size={14} />}
      <span>{inCart ? 'Added' : 'Add to Cart'}</span>
    </button>
  );
}

export default AddToCartButton;
