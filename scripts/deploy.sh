cd ../
ng build --env=prod
cf api https://api.ng.bluemix.net
cf login -u kathryn.rumptz@bankerstoolbox.com -o BKTB -s BUG -sso
cf push -f manifest.yml