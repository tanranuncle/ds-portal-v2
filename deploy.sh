npm install && npm run build
docker build -t core.devtest.com/default/qh-front:latest .
docker push core.devtest.com/default/qh-front:latest
#docker tag core.devtest.com/default/qh-front:latest qhdocker2023/qh-front:230517
#docker push qhdocker2023/qh-front:230517
