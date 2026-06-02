import { isBulletContent, parseBulletItems } from '../utils/listingTextFormat';

/**
 * Renders listing copy as a proper bullet list when the source uses • / newlines,
 * otherwise plain text (optional pre-line for multiline strings).
 */
function ListingTextValue({ value, className = '', listClassName = '', preline = false }) {
  if (value == null || value === '') return null;

  const text = String(value);
  const listCls = ['listing-bullet-list', listClassName, className].filter(Boolean).join(' ');

  if (/\n\s*\n/.test(text) && /[•\u2022]/.test(text)) {
    const sections = text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
    return (
      <div className={className || undefined}>
        {sections.map((section, i) => {
          const items = parseBulletItems(section);
          if (items.length === 0) return null;
          return (
            <ul key={i} className={[listCls, i > 0 ? 'listing-bullet-list--spaced' : ''].filter(Boolean).join(' ')}>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        })}
      </div>
    );
  }

  if (isBulletContent(value)) {
    const items = parseBulletItems(value);
    return (
      <ul className={listCls}>
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
