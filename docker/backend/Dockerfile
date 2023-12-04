FROM debian:bookworm-slim

ARG USER_ID
ARG GROUP_ID

RUN apt-get update && apt-get -y install npm curl sudo
RUN npm install -g n
RUN n 18
RUN npm i npm@latest -g
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Create user / group
RUN echo "${GROUP_ID} / ${USER_ID}"
RUN addgroup --system --gid ${GROUP_ID}  docker
RUN adduser --shell /bin/bash --system --home /backend --ingroup docker --ingroup sudo -u ${USER_ID} docker

ADD ./entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]

EXPOSE 3000
WORKDIR /backend
ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
