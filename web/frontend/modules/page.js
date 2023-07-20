import { Page, FooterHelp, Link } from "@shopify/polaris";
import styled from "styled-components";
import React, { useEffect } from "react";
import { useLocation } from "@reach/router";
import ThemeHelper from "@components/themeHelper";

const PageStyled = styled.div`
  padding-top: 2.5rem !important;
  padding-bottom: 2.5rem !important;
  .Polaris-Page {
    padding-left: 0;
    padding-right: 0;
  }
  .Polaris-PageActions {
    margin-top: 2rem;
  }
  &.Polaris-Page--hasPreview {
    .Polaris-Layout__Section--oneThird {
      flex: 0 0 550px;
      @media (max-width: 1680px) {
        flex: 0 0 450px;
      }
    }
  }
`;

const PageLayout = (props) => {
  const { title, hideFooter, fullWidth, hasPreview } = props;

  useEffect(() => {
    document.title = title ? title : "";
  }, []);

  const location = useLocation();

  let classes = ["Polaris-Page"];
  if (fullWidth) classes.push("Polaris-Page--fullWidth");
  if (hasPreview) classes.push("Polaris-Page--hasPreview");
  return (
    <PageStyled className={classes.join(" ")}>
      {location.pathname !== "/" && <ThemeHelper fixed />}
      <Page {...props}>{props.children}</Page>
      {!hideFooter && (
        <FooterHelp>
          See our&nbsp;
          <Link external url="https://docs.minimog.co/foxkit/what-is-foxkit">
            Help center
          </Link>
        </FooterHelp>
      )}
    </PageStyled>
  );
};

export default PageLayout;
