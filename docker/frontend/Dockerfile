FROM nginx:latest

ARG USER_ID
ARG GROUP_ID

# Installing node & npm
RUN apt-get update && apt-get -y install npm curl sudo
RUN npm install -g n
RUN n 18
RUN npm i npm@latest -g
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Create user / group
RUN addgroup --system --gid ${GROUP_ID}  docker
RUN adduser --shell /bin/bash --system --home /frontend --ingroup docker --ingroup sudo -u ${USER_ID}  docker

ADD ./entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]

EXPOSE 80
WORKDIR /frontend
ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
