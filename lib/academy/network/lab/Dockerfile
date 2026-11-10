# The Computer Networking course's recording lab (scripts/nwRecord.mjs).
# One image plays every role (workstation, router, DNS, web and SSH server),
# so each recorded output comes from the same Ubuntu userland a learner installs.
FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
      iproute2 iputils-ping iputils-tracepath traceroute dnsutils net-tools curl nmap \
      tcpdump tshark openssh-client openssh-server ufw iptables dnsmasq nginx \
      netcat-openbsd isc-dhcp-client ca-certificates python3 less sudo \
    && rm -rf /var/lib/apt/lists/*
