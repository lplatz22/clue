cd ../
ng build
cf api https://api.ng.bluemix.net
cf login -u luke.platz@ibm.com -o lplatz -s dev -sso
cf push clue