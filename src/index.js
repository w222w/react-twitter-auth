import React from "react";
import PropTypes from "prop-types";
import "whatwg-fetch";
import "url-search-params-polyfill";

const TwitterLoginLight = (props) => {
  
  const {
    tag,
    text,
    style,
    disabled,
    className,
    fetchRequestToken,
    fetchMethod,
    fetchOauthToken,
    credentials,
    customHeaders,
    screenName,
    onSuccess,
    forceLogin,
    onFailure,
    loginUrl,
    poolingTimeout,
    requestTokenUrl,
    twitterAuthUrl,
    dialogWidth,
    dialogHeight
  } = props;
  
  const onButtonClick = (e) => {
    e.preventDefault();
    return getRequestToken();
  };

  const fetchRequestTokenLocal = () => {
    if(fetchRequestToken){
      return fetchRequestToken()
    }
    if(!requestTokenUrl){
    
    }
    return window.fetch(requestTokenUrl, {
      method: fetchMethod,
      credentials: credentials,
      headers: getHeaders()
    })
    .then(response => {
      return response.json();
    });
  };

  const fetchOauthTokenLocal = ({oAuthVerifier, oauthToken}) => {
    if(fetchOauthToken){
      return fetchOauthToken(oAuthVerifier, oauthToken);
    }

    return window.fetch(
        `${
          loginUrl
        }?oauth_verifier=${oAuthVerifier}&oauth_token=${oauthToken}`,
        {
          method: fetchMethod,
          credentials: credentials,
          headers: getHeaders()
        }
      );

  };

  const getHeaders = () => {
    const headers = {
      ...customHeaders
    };
    headers["Content-Type"] = "application/json";
    return headers;
  };

  const getRequestToken = () => {
    var popup = openPopup();

    return fetchRequestTokenLocal()
      .then(data => {
        let authenticationUrl = `${twitterAuthUrl}?oauth_token=${
          data.oauth_token
        }&force_login=${forceLogin}`;

        if (screenName) {
          authenticationUrl = `${authenticationUrl}&screen_name=${
            screenName
          }`;
        }

        popup.location = authenticationUrl;
        polling(popup);
      })
      .catch(error => {
        popup.close();
        return onFailure(error);
      });
  };

  const openPopup = () => {
    const w = dialogWidth;
    const h = dialogHeight;
    const left = window.screen.width / 2 - w / 2;
    const top = window.screen.height / 2 - h / 2;

    return window.open(
      "",
      "",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );
  };

  const polling = (popup) => {
    const polling = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(polling);
        onFailure(new Error("Popup has been closed by user"));
      }

      const closeDialog = () => {
        clearInterval(polling);
        popup.close();
      };

      try {
        if (
          !popup.location.hostname.includes("api.twitter.com") &&
          !(popup.location.hostname === "")
        ) {
          if (popup.location.search) {
            const query = new URLSearchParams(popup.location.search);

            const oauthToken = query.get("oauth_token");
            const oauthVerifier = query.get("oauth_verifier");

            closeDialog();
            return getOauthToken(oauthVerifier, oauthToken);
          } else {
            closeDialog();
            return onFailure(
              new Error(
                "OAuth redirect has occurred but no query or hash parameters were found. " +
                  "They were either not set during the redirect, or were removed—typically by a " +
                  "routing library—before Twitter react component could read it."
              )
            );
          }
        }
      } catch (error) {
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        // A hack to get around same-origin security policy errors in IE.
      }
    }, poolingTimeout);
  };

  const getOauthToken = (oAuthVerifier, oauthToken) => {
    return fetchOauthTokenLocal({oAuthVerifier, oauthToken})
      .then(response => {
        onSuccess(response);
      })
      .catch(error => {
        return onFailure(error);
      });
  };

  const getDefaultButtonContent = () => {
    return (
      <span>
        {text}
      </span>
    );
  }


    return React.createElement(
      tag,
      {
        onClick: onButtonClick,
        style,
        disabled,
        className
      },
      props.children ? props.children : getDefaultButtonContent()
    );
};

TwitterLoginLight.propTypes = {
  tag: PropTypes.string,
  text: PropTypes.string,
  loginUrl: PropTypes.string,
  requestTokenUrl: PropTypes.string,
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  dialogWidth: PropTypes.number,
  dialogHeight: PropTypes.number,
  credentials: PropTypes.oneOf(["omit", "same-origin", "include"]),
  customHeaders: PropTypes.object,
  forceLogin: PropTypes.bool,
  screenName: PropTypes.string,
  fetchMethod: PropTypes.string,
  twitterAuthUrl: PropTypes.string,
  fetchRequestToken: PropTypes.func,
  fetchOauthToken: PropTypes.func,
  poolingTimeout: PropTypes.number,

};

TwitterLoginLight.defaultProps = {
  tag: "button",
  text: "Sign in with Twitter",
  disabled: false,
  dialogWidth: 600,
  dialogHeight: 400,
  credentials: "same-origin",
  customHeaders: {},
  forceLogin: false,
  poolingTimeout: 500,
  screenName: "",
  fetchMethod: 'POST',
  twitterAuthUrl: 'https://api.twitter.com/oauth/authenticate'
};

export default TwitterLoginLight;
