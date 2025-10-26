import type { Coffee } from "../types/coffee";

export default function MenuItemCard(props: {
  coffee: Coffee;
  onSelect: (coffee: Coffee) => void;
  maxPopularity?: number;
}) {
  const { name, description, imageUrl, popularity, isAvailable, tags } =
    props.coffee;
  const onSelect = props.onSelect;
  const coffeeItem = props.coffee;
  const maxPopularity = props.maxPopularity || 1;
  const raw = (popularity / maxPopularity) * 5;
  const starNumber = popularity > 0 ? Math.max(1, Math.ceil(raw)) : 0;
  return (
    <div
      style={{
        margin: "5px",
        padding: "5px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={() => {
        if (isAvailable) {
          onSelect(coffeeItem);
        } else {
          alert("This item is currently unavailable.");
        }
      }}
    >
      <div style={{ position: "relative" }}>
        {!props.coffee.isAvailable && (
          <div
            style={{
              position: "absolute",
              right: "3px",
              top: "3px",
              color: "white",
            }}
          >
            Unavailable
          </div>
        )}
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: "100%",
            height: "200px",
            zIndex: "1",
            objectFit: "cover",
          }}
        />
      </div>
      <div>
        <h2 style={{ fontFamily: "monospace", marginBottom: "4px" }}>{name}</h2>
        <p>{"★".repeat(starNumber) + "☆".repeat(5 - starNumber)}</p>
        <p style={{ textAlign: "justify", marginBottom: "5px" }}>
          {description}
        </p>
      </div>
      <div style={{ marginTop: "auto" }}>
        {tags &&
          tags.length > 0 &&
          tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              style={{
                border: "1px solid #ffffffff",
                padding: "2px 5px",
                borderRadius: "5px",
                marginRight: "5px",
              }}
            >
              {tag}
            </span>
          ))}
      </div>
    </div>
  );
}
