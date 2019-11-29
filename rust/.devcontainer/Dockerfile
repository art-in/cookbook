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

# auto convert line endings (CRLF to LF) if on windows host
RUN git config --global core.autocrlf true

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
    cargo-watch
RUN $HOME/.cargo/bin/cargo install \
    # for diesel orm
    diesel_cli --no-default-features --features postgres
