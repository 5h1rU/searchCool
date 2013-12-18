<?php
ini_set('display_errors', 1);
require_once('TwitterAPIExchange.php');

/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$settings = array(
    'oauth_access_token' => "77327331-ICuN3nM2kWpMi2ZE1Ym8VQFWFu35wmJVQX4izWbgv",
    'oauth_access_token_secret' => "fijF22wfMJAavFK5EdLMn4QHTZZSFVouEj9Ty9PNEwjiA",
    'consumer_key' => "POXYHGJkAZ8IK95k0uOg",
    'consumer_secret' => "0gbOFGSezXxhKbX8JzlceEtghOi0TAEpG95U6AJzvh0"
);

/** URL for REST request, see: https://dev.twitter.com/docs/api/1.1/ **/
$url = 'https://api.twitter.com/1.1/blocks/create.json';
$requestMethod = 'GET';

/** POST fields required by the URL above. See relevant docs as above **/
$postfields = array(
    'screen_name' => 'usernameToBlock', 
    'skip_status' => '1'
);

/** Perform a POST request and echo the response
$twitter = new TwitterAPIExchange($settings);
echo $twitter->buildOauth($url, $requestMethod)
             ->setPostfields($postfields)
             ->performRequest();
 **/
/** Perform a GET request and echo the response **/
/** Note: Set the GET field BEFORE calling buildOauth(); **/
$url = 'https://api.twitter.com/1.1/search/tweets.json';
$q = $_GET['q'];
$count = $_GET['count'];
$getfield = '?q='.$q.'&count='.$count;
$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();