import { isBulletContent, parseBulletItems } from '../utils/listingTextFormat';

/**
 * Renders listing copy as a proper bullet list when the source uses • / newlines,
 * otherwise plain text (optional pre-line for multiline strings).
 */
function ListingTextValue({ value, className = '', listClassName = '', preline = false }) {
  if (value == null || value === '') return null;

  if (isBulletContent(value)) {
    const items = parseBulletItems(value);
    return (
      <ul className={['listing-bullet-list', listClassName].filter(Boolean).join(' ')}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className={[preline ? 'listing-block-value--preline' : '', className].filter(Boolean).join(' ')}>
      {value}
    </div>
  );
}

export default ListingTextValue;
