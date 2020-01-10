FROM ubuntu:18.04

# skip dialog (since 'install -y' does not always help)
ARG DEBIAN_FRONTEND=noninteractive

# update default packages
RUN apt-get update

# install common packages
RUN apt-get install -y \
    build-essential \
    curl \
    # for gitlens
    git \
    # for cargo-edit
    libssl-dev \
    pkg-config

# install database (https://docs.docker.com/engine/examples/postgresql_service/)
RUN apt-get install -y \
    software-properties-common \
    postgresql-10=10.10\* \
    postgresql-client-10=10.10\* \
    postgresql-contrib=10\* \
    # for diesel orm
    libpq-dev=10.10\*
USER postgres
RUN /etc/init.d/postgresql start &&\
    psql --command "CREATE USER docker WITH SUPERUSER PASSWORD 'docker';" &&\
    createdb -O docker server
# allow remote connections
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/10/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/10/main/postgresql.conf
# preserve data between container restarts (cleaned up after rebuilds)
VOLUME ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]
USER root

# install rust (specific version to make it more reproducible)
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y --default-toolchain 1.39.0
RUN echo 'source $HOME/.cargo/env' >> $HOME/.bashrc
RUN $HOME/.cargo/bin/rustup component add rls rust-analysis rust-src
RUN $HOME/.cargo/bin/cargo install \
    cargo-edit \
    # for actix auto-reload
    systemfd \
    cargo-watch \
    # for building wasm npm package
    wasm-pack
RUN $HOME/.cargo/bin/cargo install \
    # for diesel orm
    diesel_cli --no-default-features --features postgres

# install nodejs
ARG NODE_VERSION=v12.14.0
RUN mkdir -p /opt/node
WORKDIR /opt/node
RUN curl https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-x64.tar.xz -o node-$NODE_VERSION-linux-x64.tar.xz
RUN mkdir -p /usr/local/lib/nodejs
RUN tar -xJvf node-$NODE_VERSION-linux-x64.tar.xz -C /usr/local/lib/nodejs
ENV PATH=/usr/local/lib/nodejs/node-$NODE_VERSION-linux-x64/bin:$PATH