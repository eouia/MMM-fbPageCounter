# MMM-fbPageCounter
"Likes" counter of facebook page.

![screen shot](https://github.com/eouia/MMM-fbPageCounter/blob/master/screenshot.jpg)

## Install
```sh
cd <your MagicMirror Directory>/modules
git clone https://github.com/eouia/MMM-fbPageCounter
```

## To Get FACEBOOK Access Token (Ref. from [StackOverflow](https://stackoverflow.com/questions/17197970/facebook-permanent-page-access-token) )
### 0. Create Facebook App
** You should be an owner of facebook page or should have a permission to manage target page. **

If you already have an app, skip to step 1.
1. Go to [facebook developer page](https://developers.facebook.com/apps/)
2. Click "Add a new App"
3. Setup your app. (detail is not important. just make one.)
4. After creation, see the detail app information. You can find `App ID` and `App Secret Code`.
4. Remember `App ID` and `App Secret` (Copy them to any memo program)

### 1. Get Short-lived Access Token
1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer)
2. Select the application you want to get the access token for (in the "Application" drop-down menu, not the "My Apps" menu).
3. Click "Get Token" > "Get User Access Token".
4. In the pop-up, under the "Extended Permissions" tab, check "manage_pages".
5. Click "Get Access Token".
6. Grant access from a Facebook account that has access to manage the target page.
7. Remember `Access token string` (copy it to any memo program).

### 2. Generate Long-Lived Access Token
1. Open any browser and navigate to this URL:
```
https://graph.facebook.com/v2.10/oauth/access_token?grant_type=fb_exchange_token&client_id={app_id}&client_secret={app_secret}&fb_exchange_token={short_lived_token}
```
You can get some TEXT or JSON string. The value of `access_token` is new Long-Lived Access Token, but not permanent. (It will expire after 2 month.) So you should get a permanent access token.

### 3. Get User ID
1. Open a browser and try this.
```
https://graph.facebook.com/v2.10/me?access_token={long_lived_access_token}
```
Now you get `id`. Let's go further.

### 4. Get Permanent Page Access Token
1. Open a browser and try this.
```
https://graph.facebook.com/v2.10/{account_id}/accounts?access_token={long_lived_access_token}
```
You can get some JSON string. The JSON response should have a `data` field under which is an array of items the user has access to. Find the item for the page you want the permanent access token from. The `access_token` field should have your permanent access token. 

## Configuration

Now you have `Page ID` and `Permanent Page Access Token` for your target page.
```javascript
{
    module: "MMM-fbPageCounter",
    position:"top_left",
    config: {
        access_token: "<your Permanent Page Access Token>",
    	page_id: "<your target Page ID>",
      	refresh_interval_sec: 30,
        size:'default'
    }
},
```

|field |  description |
|--- |--- |
|access_token | Your facebook page access token for target page. |
|page_id | Your facebook page ID |
|refresh_interval_sec | **minimum 10(sec)** <br> If your page has few visitors(under 5 visitors daily), use `30` or `60` as this filed. Or you could get API rate limit.<br> Over 5 visitors daily, you can use this minimum `10`. |
|size | **default:`default`** <br> `default`, `small`, `huge` are available values |

## Thanks
Thanks to Chris Nanney, who create [`CSS-Flip-Counter`](http://cnanney.com/journal/code/css-flip-counter-revisited/)
