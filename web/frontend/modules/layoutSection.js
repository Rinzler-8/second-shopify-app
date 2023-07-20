import styled from "styled-components";

const Section = styled.div`
  position: ${(e) => (e.isStuck ? "sticky" : "static")};
  top: 6.6rem;
`;

const LayoutSection = ({ children, isStuck, oneHalf, oneThird }) => {
  let classNames = [];
  if (oneHalf) classNames.push("Polaris-Layout__Section--oneHalf");
  if (oneThird) classNames.push("Polaris-Layout__Section--oneThird");
  return (
    <Section
      className={`Polaris-Layout__Section ${classNames.join(" ")}`}
      isStuck={isStuck}
    >
      {children}
    </Section>
  );
};

export default LayoutSection;
