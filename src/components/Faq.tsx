import { Icon } from "./Icon";

/** Native <details> accordion: keyboard accessible and works without JavaScript. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((item, i) => (
        <details key={item.q} className="faq-item" open={i === 0}>
          <summary>
            {item.q}
            <Icon name="chevron" size={18} className="faq-chevron" />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
