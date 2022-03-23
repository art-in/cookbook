FROM ubuntu:20.04

# skip dialog (since 'install -y' does not always help)
ARG DEBIAN_FRONTEND=noninteractive

# install common packages
RUN apt-get update
RUN apt-get install -y \
    # for rust compiler (it needs C linker installed)
    build-essential \
    # for installing rustup
    curl \
    # for vscode/gitlens
    git

# install database (https://docs.docker.com/engine/examples/postgresql_service/)
RUN apt -y update
RUN apt-get install -y \
    software-properties-common \
    postgresql-12 \
    postgresql-client-12 \
    postgresql-contrib=12\* \
    # for diesel_migrations
    libpq-dev=12\* \
    # for using git/https dependencies in cargo.toml
    libssl-dev \
    pkg-config
# connect to installed db server with default user to add new superuser and db.
# to connect to database created below with default psql client use following:
# > psql postgres://docker:password@localhost/server
USER postgres
RUN /etc/init.d/postgresql start &&\
    psql --command "CREATE ROLE docker WITH LOGIN SUPERUSER PASSWORD 'password';" &&\
    createdb -O docker server
# allow remote connections (localhost only by default)
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/12/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/12/main/postgresql.conf
# preserve data between container rebuilds
VOLUME ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]
# move back to root user
USER root

RUN curl https://sh.rustup.rs -sSf | bash -s -- -y --default-toolchain 1.59.0
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup target add wasm32-unknown-unknown
RUN cargo install diesel_cli --version 1.4.1 --locked --no-default-features --features postgres
RUN cargo install cargo-watch --version 8.1.1 --locked
RUN cargo install trunk --version 0.14.0 --locked

# start postgresql service on container startup
ENTRYPOINT service postgresql start &&\
    # do not exit immediately
    sleep infinity