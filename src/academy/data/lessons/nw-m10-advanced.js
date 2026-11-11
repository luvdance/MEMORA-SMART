/**
 * COMPUTER NETWORKING · MODULE 10 · ADVANCED NETWORKING AND PROFESSIONAL PRACTICE
 *
 * Curriculum 10.1 – 10.25 and the practical. Enterprise and hierarchical
 * design, redundancy, load balancing, scalability and QoS; SDN, NFV and
 * virtual networks; cloud networking (VPCs, subnets, route tables, security
 * groups, NACLs); Docker and Kubernetes networking; automation with Python,
 * Ansible and REST APIs; diagrams, change management and careers.
 *
 * PYTHON IS TAUGHT HERE FROM ZERO. No earlier module assumes it: the
 * automation lesson starts with print, variables, lists, loops and
 * functions, each practised before the challenges that use them.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE IS CLIENT-SAFE. Assessment answers live in lib/academy/.
 * ─────────────────────────────────────────────────────────────────────────
 */

import { dec, PY, py, term } from "./nw-kit.js";

export const SECTION_ID = "nw-s10-advanced";
const M = "nw-m10-advanced";

const SHOW_IP_INT_BRIEF = py`Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.1.1     YES manual up                    up
GigabitEthernet0/1     10.0.12.1       YES manual up                    up
GigabitEthernet0/2     unassigned      YES unset  administratively down down
GigabitEthernet0/3     172.16.5.1      YES manual down                  down`;

export const LESSONS = [
  /* ═══════════════════════════════════════════════════════════════════
     LESSON 1 · 10.1 – 10.3
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ad1-enterprise-design",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 1,
    covers: ["10.1", "10.2", "10.3"],
    title: "Enterprise Network Architecture",
    subtitle: "How large networks are organised so they scale and survive failures",
    estimatedMinutes: 35,
    intro:
      "Every network so far has had a handful of devices. Real enterprises have hundreds of switches across many buildings. This lesson shows the design patterns that keep such networks understandable, resilient and able to grow.",

    atoms: [
      {
        id: "a-nw-enterprise-architecture",
        title: "Enterprise network architecture",
        explain:
          "An ENTERPRISE NETWORK connects an organisation's people, sites and services: the CAMPUS (each building's wired and wireless LANs), the DATA CENTRE or server rooms (and increasingly the CLOUD), the WAN joining branches to head office (leased lines, MPLS from a provider, or SD-WAN, which builds encrypted tunnels over ordinary internet links and steers traffic by application), and the INTERNET EDGE (firewalls, DMZ, connections to two ISPs). Designing it starts from REQUIREMENTS, not equipment: how many users and devices, which applications and how critical they are, how much downtime is acceptable, security and compliance rules, growth over five years, and budget. Good designs are MODULAR (built from repeatable blocks, such as one standard design per floor or per branch), HIERARCHICAL (next atom), REDUNDANT where the business needs it, SECURE by design (segmentation from the start), and DOCUMENTED. The capstone asks you to design exactly such a network for a 100-person organisation.",
        decision: dec(
          "A network architect is asked to 'buy the best switches' for a new head office, before anyone has said how many people will work there or which applications they use.",
          "What should the architect do first?",
          ["Gather requirements: users and devices, applications and their criticality, acceptable downtime, security needs, growth and budget", "Designs follow requirements; equipment choices follow designs."],
          [
            ["Order the most expensive switches available", "Cost without requirements risks both overspending and the wrong features."],
            ["Copy the design of a different company's network exactly", "Their requirements may be completely different."],
            ["Start cabling, and decide on equipment later", "Cabling also depends on the design."],
          ]
        ),
      },
      {
        id: "a-nw-hierarchical-design",
        title: "Hierarchical network design",
        explain:
          "HIERARCHICAL DESIGN divides the network into LAYERS, each with a clear role, instead of a flat mesh of switches connected however was convenient. The benefits: SCALABILITY (add another access block without redesigning the rest), PREDICTABLE traffic paths, easier TROUBLESHOOTING (you know what each layer does and where a fault can be), FAULT ISOLATION (a problem in one block stays there), and clear places to apply POLICY. The classic model has three layers, ACCESS, DISTRIBUTION and CORE (next atom); smaller networks merge the core and distribution into one COLLAPSED CORE, giving a two-tier design that suits a single building. Data centres use a different pattern, SPINE-LEAF: every leaf switch (where servers connect) links to every spine switch, so any two servers are always exactly two hops apart and capacity grows by adding spines or leaves. Whatever the pattern, the layers should be connected in a structured way, with redundant links between them.",
        decision: dec(
          "A growing company's network has been built by daisy-chaining switches under desks as new staff arrived. Faults now take hours to trace and one failure can cut off half the office.",
          "What redesign does the course recommend?",
          ["A hierarchical design: access switches in each wiring closet connecting to redundant distribution (or collapsed core) switches", "Structured layers make faults traceable and contain them."],
          [
            ["Add more switches to the chain", "That makes the chain longer and more fragile."],
            ["Replace all switches with hubs", "Hubs are worse in every way."],
            ["Put every user on Wi-Fi so cabling does not matter", "Access points still need a structured wired network behind them."],
          ]
        ),
      },
      {
        id: "a-nw-core-distribution-access",
        title: "Core, distribution and access layers",
        explain:
          "The ACCESS LAYER is where users and devices connect: access switches in each wiring closet, with features at the edge such as PoE for phones and access points, VLAN assignment, port security and 802.1X. The DISTRIBUTION LAYER aggregates the access switches of a building or area: it is where VLANs end and are ROUTED (usually Layer 3 switches with SVIs, as in Module 5), where policies such as ACLs between departments are applied, where routes are summarised, and where first-hop redundancy (HSRP or VRRP) provides the hosts' gateway. The CORE LAYER is the high-speed backbone joining the distribution blocks, the data centre and the internet edge: its only job is to move traffic as fast and reliably as possible, so it has no slow features such as heavy filtering, and it is fully redundant. Every access switch connects to TWO distribution switches, and the distribution switches connect to two core switches, so no single device or link failure isolates anyone.",
        table: {
          caption: "The three layers.",
          headers: ["Layer", "Connects", "Typical jobs"],
          rows: [
            ["Access", "Users, phones, printers, access points", "PoE, VLANs, port security, 802.1X"],
            ["Distribution", "Access switches of a building or area", "Inter-VLAN routing, ACLs, summarisation, HSRP/VRRP"],
            ["Core", "Distribution blocks, data centre, internet edge", "Fast, redundant forwarding; minimal features"],
          ],
        },
        decision: dec(
          "In a three-tier campus design, where should the ACLs that control traffic between the Finance and HR VLANs be applied?",
          "Which layer is the right place?",
          ["The distribution layer, where the VLANs are routed and inter-VLAN policy is applied", "Distribution is where VLANs meet and policy belongs."],
          [
            ["The core layer", "The core should forward fast with minimal features."],
            ["On each user's PC", "Host firewalls help, but network policy between VLANs belongs at distribution."],
            ["Nowhere; VLANs cannot be filtered", "Routed VLANs can be filtered with ACLs."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 2 · 10.4 – 10.7
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ad2-availability",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 2,
    covers: ["10.4", "10.5", "10.6", "10.7"],
    title: "Redundancy, Load Balancing, Scalability and QoS",
    subtitle: "Keeping the network up, spreading the load, planning for growth, and putting voice first",
    estimatedMinutes: 55,
    intro:
      "Users judge a network by two things: is it there, and is it fast for what they are doing right now? This lesson covers the techniques that deliver both.",

    atoms: [
      {
        id: "a-nw-redundancy-ha",
        title: "Redundancy and high availability",
        explain:
          "AVAILABILITY is the percentage of time a service works, often written in 'nines': 99.9 percent (three nines) allows about 8.8 hours of downtime a year, 99.99 percent about 53 minutes, 99.999 percent about 5 minutes. Each extra nine costs far more, so the target should match what the business needs. HIGH AVAILABILITY comes from removing SINGLE POINTS OF FAILURE with REDUNDANCY at every layer: two power supplies and two power feeds (with a UPS and generator); two links between layers (bundled with EtherChannel, Module 5); two distribution and core switches; two gateways sharing a virtual address (HSRP or VRRP, Module 4); two firewalls in a failover pair; two internet providers over different routes (Module 6). Redundant paths only help if the network can USE them automatically: spanning tree unblocks a backup link, and DYNAMIC ROUTING recalculates around a failure in seconds. In the lab below, the direct link between two sites has failed, and a backup path through a third router exists but is not in OSPF yet.",
        netLab: {
          task:
            "R1 and R2 normally talk over their direct link, which has just failed (it is shut down). A backup path exists through R3: R1–R3 (10.0.13.0/30) and R3–R2 (10.0.23.0/30). R2 and R3 already run OSPF on those links, but R1 does not advertise its link to R3. Add the missing network statement on R1 (area 0) so OSPF reroutes through R3 and PC1 reaches PC2 again.",
          devices: [
            { id: "PC1", kind: "pc", x: 6, y: 18, ip: "192.168.1.10/24", gateway: "192.168.1.1" },
            { id: "R1", kind: "router", x: 30, y: 18 },
            { id: "R2", kind: "router", x: 70, y: 18 },
            { id: "PC2", kind: "pc", x: 94, y: 18, ip: "192.168.2.10/24", gateway: "192.168.2.1" },
            { id: "R3", kind: "router", x: 50, y: 46, note: "backup path" },
          ],
          links: [["PC1:fa0", "R1:g0/0"], ["R1:g0/1", "R2:g0/1"], ["R2:g0/0", "PC2:fa0"], ["R1:g0/2", "R3:g0/1"], ["R3:g0/2", "R2:g0/2"]],
          config: {
            R1: "hostname R1\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.0.12.1 255.255.255.252\n shutdown\ninterface g0/2\n ip address 10.0.13.1 255.255.255.252\n no shutdown\nrouter ospf 1\n network 192.168.1.0 0.0.0.255 area 0\n network 10.0.12.0 0.0.0.3 area 0",
            R2: "hostname R2\ninterface g0/0\n ip address 192.168.2.1 255.255.255.0\n no shutdown\ninterface g0/1\n ip address 10.0.12.2 255.255.255.252\n no shutdown\ninterface g0/2\n ip address 10.0.23.2 255.255.255.252\n no shutdown\nrouter ospf 1\n network 192.168.2.0 0.0.0.255 area 0\n network 10.0.12.0 0.0.0.3 area 0\n network 10.0.23.0 0.0.0.3 area 0",
            R3: "hostname R3\ninterface g0/1\n ip address 10.0.13.2 255.255.255.252\n no shutdown\ninterface g0/2\n ip address 10.0.23.1 255.255.255.252\n no shutdown\nrouter ospf 1\n network 10.0.13.0 0.0.0.3 area 0\n network 10.0.23.0 0.0.0.3 area 0",
          },
          start: "R1",
          height: 50,
          goals: [
            { type: "route", device: "R1", prefix: "192.168.2.0/24", source: "O", label: "R1 learns 192.168.2.0/24 through the backup path" },
            { type: "ping", from: "PC1", to: "192.168.2.10", label: "PC1 reaches PC2 while the direct link is down" },
          ],
          hint: "On R1: enable, configure terminal, router ospf 1, network 10.0.13.0 0.0.0.3 area 0, end. Then show ip ospf neighbor and show ip route, and tracert 192.168.2.10 from PC1 to see the path through R3.",
          successMessage: "With the backup link in OSPF, the failure of the direct link no longer cuts the sites apart. Redundancy only counts when the network can use it automatically.",
        },
      },
      {
        id: "a-nw-load-balancing",
        title: "Load balancing fundamentals",
        explain:
          "LOAD BALANCING spreads work across several resources, both to handle more load and to survive the failure of one. Inside the network: routing protocols can use several EQUAL-COST paths at once (ECMP), and EtherChannel spreads flows across bundled links. For SERVICES, a LOAD BALANCER (an appliance, software such as HAProxy or nginx, or a cloud service) receives client connections on one virtual IP address and distributes them to a POOL of real servers by an ALGORITHM: ROUND ROBIN (each server in turn), LEAST CONNECTIONS (the least busy), or by a HASH of the client's address so the same client keeps reaching the same server (SESSION PERSISTENCE, needed by some applications). HEALTH CHECKS (for example, fetching a page from each server every few seconds) remove failed servers from the pool automatically. Load balancers often also terminate TLS and act as reverse proxies (Module 4). At global scale, DNS-based load balancing and anycast (Module 6) send users to the nearest healthy site.",
        decision: dec(
          "An online shop runs on three web servers behind a load balancer. One server crashes during a sale.",
          "What keeps customers from noticing?",
          ["The load balancer's health checks detect the failed server and stop sending it connections, so the other two carry the traffic", "Health checks plus a pool of servers give both capacity and resilience."],
          [
            ["Customers' browsers automatically try another server", "Browsers know only the load balancer's address."],
            ["The crashed server restarts in under a second", "It may not; the pool absorbs the failure meanwhile."],
            ["DNS changes the shop's name", "The name stays; the load balancer handles the failure."],
          ]
        ),
      },
      {
        id: "a-nw-scalability",
        title: "Network scalability",
        explain:
          "A SCALABLE network can grow (more users, sites, devices and traffic) without redesign or a drop in performance. What makes it so: a HIERARCHICAL, MODULAR design, where growth means adding another standard block; an ADDRESSING PLAN with room to grow, allocated in contiguous blocks so routes can be SUMMARISED (Module 3) and routing tables stay small; DYNAMIC ROUTING with areas (OSPF areas) instead of hand-written static routes; enough CAPACITY on uplinks and the internet edge, with headroom (Module 9's 70 to 80 percent rule); equipment chosen with spare ports, power budget and performance; and AUTOMATION (Lesson 6), so configuring the hundredth switch is as fast and consistent as the first. Common scaling mistakes: one giant flat VLAN, addresses allocated randomly so nothing can be summarised, and processes that depend on one person typing commands by hand.",
        decision: dec(
          "A bank's addressing plan gave each new branch 'the next free /24 anywhere in 10.0.0.0/8', so branch networks are scattered. Head-office routers now hold hundreds of separate branch routes.",
          "What planning practice would have kept the routing tables small?",
          ["Allocating each region's branches from one contiguous block, so every region can be summarised as a single route", "Contiguous allocation enables summarisation."],
          [
            ["Using static routes instead of OSPF", "That makes the problem worse, by hand."],
            ["Giving every branch a /16", "Wasteful, and still scattered unless contiguous."],
            ["Putting all branches in one VLAN", "VLANs do not span WANs this way and would be one huge broadcast domain."],
          ]
        ),
      },
      {
        id: "a-nw-qos",
        title: "Quality of Service (QoS)",
        explain:
          "When a link is busy, QUALITY OF SERVICE decides which traffic goes first. Without it, every packet waits in the same queue, so a large download can make voice calls choppy. QoS works in three steps. CLASSIFICATION identifies traffic (by application, port, VLAN or source). MARKING labels each packet so devices downstream need not classify it again: in the IP header's DSCP field (voice is usually marked EF, Expedited Forwarding, value 46; video conferencing AF41; ordinary traffic best effort, 0), or with the 3-bit priority in the 802.1Q tag on a trunk. QUEUING then serves the queues by policy at each congested interface: a strict PRIORITY QUEUE for voice (with a limit, so it cannot starve everything else), guaranteed shares of bandwidth for business applications, and best effort for the rest; POLICING and SHAPING limit a class's rate. QoS only matters where there is congestion (mostly WAN and internet links), it cannot create bandwidth, and it must be applied consistently along the whole path, ideally TRUSTING markings only from devices you control (such as IP phones).",
        decision: dec(
          "A company's VoIP calls between branches break up whenever large files are being copied over the 50 Mbps WAN link. Upgrading the link is not possible this year.",
          "What should the network team configure?",
          ["QoS: mark voice traffic (DSCP EF) and give it a limited priority queue on the WAN interfaces, so it is sent ahead of the file copies", "QoS cannot add bandwidth but can decide who waits."],
          [
            ["Make the file copies use UDP", "That does not prioritise voice."],
            ["Increase the Wi-Fi transmit power", "The bottleneck is the WAN link."],
            ["Give every packet the highest priority", "If everything is priority, nothing is."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 3 · 10.8 – 10.10
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ad3-sdn-nfv",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 3,
    covers: ["10.8", "10.9", "10.10"],
    title: "SDN, NFV and Virtual Networks",
    subtitle: "Networks controlled by software, network devices as software, and networks inside computers",
    estimatedMinutes: 35,
    intro:
      "Until recently every network device was configured one at a time, and every function was a box. Software is changing both. This lesson explains the ideas behind modern data centres, cloud platforms and SD-WAN.",

    atoms: [
      {
        id: "a-nw-sdn",
        title: "Software-Defined Networking (SDN)",
        explain:
          "Every network device has two parts. The CONTROL PLANE decides where traffic should go (running routing protocols, building tables), and the DATA PLANE actually forwards packets according to those decisions. Traditionally, each device has both, and is configured individually. SOFTWARE-DEFINED NETWORKING separates them: a central SDN CONTROLLER holds the control plane for the whole network, has a complete view of it, and programs the data planes of the switches and routers through SOUTHBOUND interfaces (such as OpenFlow, NETCONF or vendors' protocols). Administrators and applications talk to the controller through NORTHBOUND APIs (usually REST, Lesson 7), expressing intent ('Finance may reach the payroll servers only') rather than typing commands on fifty devices. Benefits: central, consistent policy, faster changes, automation, and visibility. Examples: Cisco ACI and Catalyst Center in campuses and data centres, the networks inside public clouds, and SD-WAN controllers that steer traffic across a company's internet links.",
        decision: dec(
          "A data centre team must apply the same new security policy to 200 switches by the end of the day.",
          "Why would an SDN architecture make this easier?",
          ["The policy is defined once on the central controller, which programs every switch's data plane consistently", "Central control replaces device-by-device configuration."],
          [
            ["SDN switches need no configuration at all, ever", "They are configured, centrally."],
            ["SDN removes the data plane", "The data plane still forwards packets; control moves to the controller."],
            ["SDN only works with hubs", "SDN works with switches and routers."],
          ]
        ),
      },
      {
        id: "a-nw-nfv",
        title: "Network Function Virtualisation (NFV)",
        explain:
          "NETWORK FUNCTION VIRTUALISATION turns network functions that used to be dedicated hardware boxes (routers, firewalls, load balancers, VPN gateways, WAN optimisers) into SOFTWARE running as virtual machines or containers on ordinary servers. These VIRTUAL NETWORK FUNCTIONS (VNFs) can be deployed in minutes instead of waiting for hardware to be shipped and racked, scaled up or down with demand, moved between servers, and chained together in software (SERVICE CHAINING: traffic passes through a virtual firewall, then a virtual load balancer). Mobile operators run large parts of their 4G and 5G core networks as NFV; enterprises deploy virtual firewalls and routers in branches (on one small server running several functions, a 'universal CPE') and in the cloud. NFV is complementary to SDN: SDN centralises control of the network, NFV turns its functions into software, and the two are often used together. The trade-offs: performance on general-purpose servers needs careful tuning, and the virtual infrastructure itself must be secured and kept highly available.",
        decision: dec(
          "A company opens a temporary site for a three-month project and needs a firewall and a VPN gateway there next week.",
          "Which approach does NFV make possible?",
          ["Deploy a virtual firewall and VPN gateway as software on a small server or in the cloud, then remove them when the project ends", "Software functions are fast to deploy and to retire."],
          [
            ["Order dedicated hardware with a three-month delivery time", "That arrives as the project ends."],
            ["Run the site with no firewall", "Security is still required."],
            ["Use a hub as a firewall", "Hubs filter nothing."],
          ]
        ),
      },
      {
        id: "a-nw-virtual-networks",
        title: "Virtual networks",
        explain:
          "A VIRTUAL NETWORK is a network that exists in software rather than in its own cables and boxes. You have already used several: VLANs (logical networks on shared switches); VPNs (private networks over the internet); and the virtual switches inside hypervisors (VirtualBox, VMware, Hyper-V, KVM), which connect virtual machines to each other and to the physical network (the NAT, bridged and host-only modes in Module 7 are virtual network options). Data centres and clouds go further with OVERLAY networks: tunnels such as VXLAN carry Layer 2 networks across a routed Layer 3 'underlay', with a 24-bit identifier allowing 16 million separate virtual networks (against VLANs' 4,094), so thousands of customers or applications can each have their own isolated networks on the same physical infrastructure. Cloud VPCs (Lesson 4) and container networks (Lesson 5) are virtual networks of exactly this kind. The physical network still matters: every virtual network ultimately runs over real links whose capacity and reliability it depends on.",
        decision: dec(
          "A cloud provider must give 50,000 customers each their own isolated Layer 2 networks on shared physical switches.",
          "Why are overlays such as VXLAN used instead of VLANs?",
          ["VLANs are limited to 4,094 IDs, while VXLAN's 24-bit identifier allows about 16 million virtual networks over a routed underlay", "Scale is the main reason overlays exist."],
          [
            ["VLANs cannot isolate traffic at all", "VLANs isolate traffic; they just do not scale to this number."],
            ["VXLAN needs no physical network", "It runs over a physical underlay."],
            ["VLANs only work on Wi-Fi", "VLANs work on switches, wired and wireless."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 4 · 10.11 – 10.15
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ad4-cloud",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 4,
    covers: ["10.11", "10.12", "10.13", "10.14", "10.15"],
    title: "Cloud Networking",
    subtitle: "VPCs, subnets, route tables, security groups and network ACLs",
    estimatedMinutes: 60,
    intro:
      "Much of what organisations run now lives in public clouds, and every cloud deployment starts with a network. The good news: it is all the networking you already know (subnets, routes, gateways, firewalls), delivered as software.",

    atoms: [
      {
        id: "a-nw-cloud-fundamentals",
        title: "Cloud networking fundamentals",
        explain:
          "CLOUD COMPUTING provides computing, storage and networking on demand over the internet, paid for as used. Service models: IaaS (infrastructure: virtual machines and networks you manage), PaaS (platforms: you deploy code, the provider runs the servers) and SaaS (software you just use, such as Microsoft 365). Under the SHARED RESPONSIBILITY MODEL, the provider secures the physical data centres, hardware and the virtualisation layer; YOU are responsible for what you build on it: your virtual network design, firewall rules, access permissions, operating systems and data. Most cloud breaches come from the customer's side (a storage bucket left public, a database open to the internet, leaked access keys), not from the provider. Cloud networks are built from software objects: virtual networks, subnets, route tables, gateways, firewalls and load balancers, created in a web console, from the command line, or as code (Terraform, Lesson 6's automation ideas). Connecting the office to the cloud uses a site-to-site VPN (Module 8) or a private dedicated connection (AWS Direct Connect, Azure ExpressRoute, Google Cloud Interconnect).",
        decision: dec(
          "A company's customer database on a cloud virtual machine is found open to the whole internet on its database port, because a firewall rule allowed 0.0.0.0/0.",
          "Under the shared responsibility model, whose responsibility was that rule?",
          ["The customer's: the provider secures the infrastructure, but customers configure their own network and firewall rules", "Configuration of what you build is your side of the model."],
          [
            ["The cloud provider's, because it owns the data centre", "The provider secures the platform, not your rule choices."],
            ["Nobody's, because cloud networks cannot be secured", "They can, with correct rules."],
            ["The internet service provider's", "The ISP has no control over cloud firewall rules."],
          ]
        ),
      },
      {
        id: "a-nw-cloud-providers",
        title: "AWS, Azure and Google Cloud networking concepts",
        explain:
          "The three largest public clouds use different names for the same ideas. The private network you build: a VPC (Virtual Private Cloud) in AWS and Google Cloud, a VNet (Virtual Network) in Azure. Inside it, SUBNETS. The firewall attached to each virtual machine or network interface: a SECURITY GROUP in AWS, a Network Security Group (NSG) in Azure, firewall rules in Google Cloud. The door to the internet: an INTERNET GATEWAY in AWS, built into Azure and Google networks. Outbound internet for private machines: a NAT GATEWAY in all three. Connecting networks: VPC PEERING, transit gateways or hubs, and VPN gateways. Geography: REGIONS (a city or area, such as AWS's Cape Town region or Microsoft's Johannesburg region in South Africa, the main African regions) made of AVAILABILITY ZONES (separate data centres with independent power and networking), so a design spread across two zones survives a data-centre failure. Learn one cloud well and the others follow quickly.",
        table: {
          caption: "The same concepts, three names.",
          headers: ["Concept", "AWS", "Azure", "Google Cloud"],
          rows: [
            ["Private network", "VPC", "Virtual Network (VNet)", "VPC"],
            ["Instance firewall", "Security group", "Network security group", "Firewall rules"],
            ["Subnet firewall (stateless)", "Network ACL", "(NSG on subnet)", "(firewall rules)"],
            ["Internet access", "Internet gateway", "Built in", "Built in"],
            ["Private outbound access", "NAT gateway", "NAT gateway", "Cloud NAT"],
            ["Private link to the office", "Direct Connect", "ExpressRoute", "Cloud Interconnect"],
          ],
        },
        decision: dec(
          "A Nigerian company wants its cloud application to survive the failure of an entire data centre, with low latency for African users.",
          "How should it deploy?",
          ["In an African region (for example South Africa), across at least two availability zones", "Zones are separate data centres; the region choice keeps latency low."],
          [
            ["In one availability zone in Europe", "One zone is a single point of failure, and Europe adds latency."],
            ["On a single large virtual machine", "One VM is a single point of failure."],
            ["In two subnets of the same zone", "Both subnets fail with the zone."],
          ]
        ),
      },
      {
        id: "a-nw-vpc",
        title: "Virtual Private Clouds (VPCs)",
        explain:
          "A VPC is your own isolated, private network in the cloud, defined by a private CIDR block (from the RFC 1918 ranges, Module 3), for example 10.20.0.0/16. Plan it like any enterprise addressing plan: big enough for growth (a /16 gives 65,536 addresses), and NOT OVERLAPPING with your office networks or other VPCs you will connect it to, because overlapping networks cannot be routed to each other. Inside the VPC you create SUBNETS, each in one availability zone, usually /24 or similar: for example public subnets 10.20.1.0/24 and 10.20.2.0/24 in two zones, and private subnets 10.20.11.0/24 and 10.20.12.0/24. One cloud detail to remember: AWS RESERVES 5 addresses in every subnet (the network address, the next three for the router, DNS and future use, and the last), so a /24 has 256 − 5 = 251 usable addresses there, not 254. Work out the plan below.",
        netCalc: {
          task: "A company creates the VPC 10.20.0.0/16 in AWS and will divide it into /24 subnets.",
          questions: [
            { q: "How many /24 subnets fit in the /16?", answer: "256", hint: "Borrowed bits: 24 − 16 = 8.", working: "2^8 = 256 subnets" },
            { q: "What is the third /24 subnet? (Write it with its prefix.)", answer: "10.20.2.0/24", accept: ["10.20.2.0"], check: { fn: "nthSubnet", arg: "10.20.0.0/16 24 3" }, hint: "They go 10.20.0.0, 10.20.1.0, 10.20.2.0 …", working: "1st 10.20.0.0, 2nd 10.20.1.0, 3rd 10.20.2.0/24" },
            { q: "AWS reserves 5 addresses in every subnet. How many usable addresses does a /24 subnet have in AWS?", answer: "251", hint: "256 addresses minus 5.", working: "2^8 = 256; 256 − 5 = 251" },
            { q: "The office LAN is 10.20.5.0/24. Does it overlap with this VPC? (yes or no)", answer: "yes", accept: ["y"], hint: "Is 10.20.5.0 inside 10.20.0.0/16?", working: "10.20.0.0/16 covers 10.20.0.0 – 10.20.255.255, which includes 10.20.5.0/24 → overlap; choose a different VPC block" },
          ],
          successMessage: "Plan the VPC block so it never overlaps anything you will connect to it. Changing it later means rebuilding.",
        },
      },
      {
        id: "a-nw-cloud-subnets-routes",
        title: "Cloud subnets and route tables",
        explain:
          "Every cloud subnet is associated with a ROUTE TABLE, a list of destination CIDRs and TARGETS, just like a router's table. Every route table automatically includes a LOCAL route for the whole VPC (10.20.0.0/16 → local), so all subnets in the VPC can reach each other. What makes a subnet PUBLIC or PRIVATE is nothing more than its route table. A PUBLIC subnet has a default route (0.0.0.0/0) to the INTERNET GATEWAY, so resources there with public IP addresses can be reached from, and reach, the internet: load balancers and bastion hosts go here. A PRIVATE subnet has no route to the internet gateway; for outbound internet access (software updates), its default route points to a NAT GATEWAY placed in a public subnet, which works like PAT (Module 4): outbound connections allowed, unsolicited inbound impossible. Application servers and databases go in private subnets. Other targets you will see: VPN gateways and transit gateways (routes to the office), and peering connections (routes to other VPCs).",
        decision: dec(
          "A company's database servers in a cloud subnet must download security updates from the internet, but must never be reachable from the internet.",
          "How should their subnet be routed?",
          ["As a private subnet whose default route points to a NAT gateway in a public subnet", "NAT allows outbound connections and blocks unsolicited inbound ones."],
          [
            ["A default route to the internet gateway, with public IP addresses on the databases", "That makes them reachable from the internet."],
            ["No routes at all, not even the local VPC route", "Then the application servers could not reach them either."],
            ["A route to the office VPN only", "That does not provide internet updates (unless all traffic is sent through the office)."],
          ]
        ),
      },
      {
        id: "a-nw-security-groups-nacls",
        title: "Cloud security groups and network ACLs",
        explain:
          "Clouds give you two layers of firewall. SECURITY GROUPS attach to instances (their network interfaces). They are STATEFUL (return traffic is allowed automatically, Module 8), have ALLOW rules only (anything not allowed is denied), all rules are evaluated together, and a rule's source can be another security group ('allow port 5432 from the web servers' group'), which is how tiers are linked without hard-coding addresses. NETWORK ACLs (in AWS) attach to SUBNETS. They are STATELESS (return traffic must be allowed explicitly, including the ephemeral port range 1024–65535 for replies), have both ALLOW and DENY rules, and are evaluated IN ORDER by rule number, lowest first, with a final deny: first match wins, exactly like the firewall rules you ordered in Modules 7 and 8. Use security groups as the main, fine-grained control, and network ACLs as a coarse extra layer, for example to block a known-bad address range for a whole subnet. The exercise below is a subnet's network ACL, with rules out of order.",
        firewallExercise: {
          brief:
            "This network ACL protects the web subnet. A known attacker range, 203.0.113.0/24, must be blocked from everything. Everyone else may reach HTTPS (TCP 443). Replies to the web servers' own outbound connections come back to ephemeral ports 1024–65535 and must be allowed. Reorder the rules so every sample packet gets the right result.",
          rules: [
            { id: "allow-https", action: "allow", proto: "tcp", source: "any", dest: "10.20.1.0/24", port: 443 },
            { id: "allow-ephemeral", action: "allow", proto: "tcp", source: "any", dest: "10.20.1.0/24", port: "1024-65535" },
            { id: "deny-attacker", action: "deny", proto: "any", source: "203.0.113.0/24", dest: "any", port: "any" },
          ],
          traffic: [
            { id: "n1", label: "Customer 41.58.10.20 opening HTTPS", proto: "tcp", source: "41.58.10.20", dest: "10.20.1.15", port: 443, expect: "allow" },
            { id: "n2", label: "Attacker 203.0.113.66 opening HTTPS", proto: "tcp", source: "203.0.113.66", dest: "10.20.1.15", port: 443, expect: "deny" },
            { id: "n3", label: "Reply from an update server to a web server's port 50122", proto: "tcp", source: "151.101.2.132", dest: "10.20.1.15", port: 50122, expect: "allow" },
            { id: "n4", label: "Anyone trying SSH (TCP 22) to a web server", proto: "tcp", source: "41.58.10.20", dest: "10.20.1.15", port: 22, expect: "deny" },
          ],
          expect: true,
          successMessage:
            "The attacker deny comes first, so it wins before the broad allows; HTTPS and ephemeral replies are allowed; SSH falls to the final deny. Stateless rules must allow the return traffic themselves.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 5 · 10.16 – 10.18
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ad5-containers",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 5,
    covers: ["10.16", "10.17", "10.18"],
    title: "Container Networking: Docker and Kubernetes",
    subtitle: "How applications in containers find and talk to each other",
    estimatedMinutes: 45,
    intro:
      "Modern applications are packaged as containers and run in their hundreds. Each one needs an address and a way to reach the others. This lesson shows how Docker and Kubernetes provide that, on real Docker commands.",

    atoms: [
      {
        id: "a-nw-container-networking",
        title: "Container networking fundamentals",
        explain:
          "A CONTAINER packages an application with everything it needs and runs it isolated from other applications, sharing the host's operating system kernel (lighter and faster to start than a virtual machine). Docker is the best-known tool for building and running containers. For networking, each container normally gets its own NETWORK NAMESPACE: its own interfaces, IP address, routing table and ports, as if it were a small separate computer. The host connects these namespaces with VIRTUAL ETHERNET pairs (veth) to a software BRIDGE (a virtual switch) and uses NAT, so containers can reach the outside world through the host's address; to reach a container from outside, a host port is PUBLISHED (mapped) to a container port, for example host port 8080 to the container's port 80 (docker run -p 8080:80). Containers on the same user-created network can find each other BY NAME, because Docker runs a small DNS service for them. The same ideas you know (switches, addresses, NAT, DNS, port numbers) are simply implemented in software inside the host.",
        decision: dec(
          "A web server runs in a container on port 80, but nobody outside the host can reach it.",
          "What is most likely missing?",
          ["A published port mapping a host port to the container's port 80 (for example -p 8080:80), so outside traffic can reach it through the host", "Containers sit behind the host's NAT unless ports are published."],
          [
            ["A second container", "One container is enough; it needs a published port."],
            ["A VLAN on the container", "Containers are reached through the host's port mapping, not VLANs."],
            ["Wi-Fi inside the container", "Containers do not have their own radios."],
          ]
        ),
      },
      {
        id: "a-nw-docker-networks",
        title: "Docker bridge, host and overlay networks",
        explain:
          "Docker offers several network DRIVERS. BRIDGE (the default): containers attach to a software bridge on the host, get private addresses, and reach outside through NAT. Always create your own USER-DEFINED bridge networks for an application, because containers on them can resolve each other by name and are isolated from containers on other networks. HOST: the container shares the host's network stack directly (no isolation, no NAT, best performance). NONE: no networking at all. OVERLAY: a network spanning SEVERAL Docker hosts, using VXLAN tunnels (Lesson 3), so containers on different machines share one network, as used by Docker Swarm. MACVLAN gives a container its own MAC address on the physical network. The commands: docker network ls lists networks (add --filter name= followed by a name to show just one); docker network create followed by options and a name creates one, where --driver bridge chooses the driver and --subnet sets its address range: docker network create --driver bridge --subnet 172.30.0.0/24 app-net; docker run --network followed by the network name starts a container on it (with -d to run in the background and --name to name it); docker exec followed by a container name and a command runs that command inside the container; and docker network inspect shows a network's details. The recording was made with the real Docker command line; its containers use the course's lab image, mst-netlab:1 (Ubuntu with the network tools installed), and | cut -c1-12 shortens the long container IDs Docker prints.",
        terminalExercise: term("m10-docker", {
          goal: "Create a user-defined bridge network for an application, named app-net, with the subnet 172.30.0.0/24.",
          accept: ["docker network create --driver bridge --subnet 172.30.0.0/24 app-net"],
          near: [
            { command: "docker network ls --filter name=app-net", why: "That lists app-net once it exists, a good check afterwards. Create it first." },
            { command: "docker exec web ping -c 2 db", why: "That proves two containers on app-net reach each other by name. The network has to be created first." },
          ],
          hint: "docker network create, --driver bridge, --subnet 172.30.0.0/24, then the name app-net.",
          success: "Docker printed the new network's ID. Read on: two containers started on app-net get addresses from 172.30.0.0/24, and web pings db BY NAME thanks to Docker's built-in DNS.",
        }),
      },
      {
        id: "a-nw-kubernetes",
        title: "Kubernetes networking introduction",
        explain:
          "KUBERNETES (K8s) runs containers across a CLUSTER of machines (NODES), restarting and moving them as needed. Its smallest unit is a POD: one or more containers that share an IP address. Kubernetes networking has simple rules: every pod gets its own IP address, and every pod can reach every other pod directly, on any node, without NAT. A CNI PLUGIN (Calico, Cilium, Flannel and others) implements this, using routing or overlay tunnels. Because pods come and go and their addresses change, applications reach each other through SERVICES: a stable virtual IP address and DNS name (such as payments.default.svc.cluster.local) that load-balances to whichever pods are currently healthy. To expose an application outside the cluster, a Service of type NodePort or LoadBalancer is used, or an INGRESS, which routes HTTP and HTTPS requests by hostname and path to services, often terminating TLS. NETWORK POLICIES are Kubernetes' firewall: by default every pod can reach every other, so policies restrict which pods may talk to which, the same deny-by-default thinking as Module 8.",
        decision: dec(
          "In a Kubernetes cluster, the front-end pods must reach the payments pods, whose IP addresses change every time they are restarted or rescheduled.",
          "How should the front end find them?",
          ["Through a Kubernetes Service, which gives the payments pods a stable name and virtual IP and load-balances to the current healthy pods", "Services exist precisely because pod addresses are temporary."],
          [
            ["By hard-coding today's pod IP addresses", "They will change at the next restart."],
            ["By ARP broadcasts across the cluster", "Applications use Services and DNS, not ARP."],
            ["By giving every pod the same IP address", "Each pod has its own address."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 6 · 10.19 – 10.20
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ad6-automation-python",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 6,
    covers: ["10.19", "10.20"],
    title: "Network Automation and Python",
    subtitle: "Why engineers automate, and Python from the very first line",
    estimatedMinutes: 80,
    intro:
      "Configuring one switch by hand is fine; configuring two hundred is how mistakes happen. This lesson explains automation, then teaches you Python from zero, one small step at a time, until you can write a program that checks a router's interfaces for you. No programming experience is assumed.",

    atoms: [
      {
        id: "a-nw-automation-fundamentals",
        title: "Network automation fundamentals",
        explain:
          "NETWORK AUTOMATION uses software to configure, check and manage network devices instead of typing commands device by device. Why: SPEED (push a change to 200 switches in minutes), CONSISTENCY (every device gets exactly the same configuration, with no typing mistakes), RELIABILITY (tested changes, automatic checks before and after), and freeing engineers from repetitive work. What gets automated: backing up configurations, deploying standard configurations to new devices, rolling out changes (a new VLAN on every access switch), compliance checks (is every device using SSH only?), and gathering data for reports and troubleshooting. Tools: scripts in PYTHON (the most widely used language in networking, with libraries such as Netmiko, NAPALM and Nornir for talking to devices); configuration management tools such as ANSIBLE (Lesson 7); REST APIs on devices and controllers (Lesson 7); and 'infrastructure as code' tools such as Terraform for cloud networks. The principle behind them is the same: describe the desired state in files kept under version control, test it, and let software apply it.",
        decision: dec(
          "An engineer must add VLAN 50 to 180 access switches. Doing it by hand would take two days, and last time a similar change left a typo on three switches that took a week to find.",
          "What does automation offer here?",
          ["A script or playbook applies the identical change to all 180 switches in minutes, and can verify each one afterwards", "Speed and consistency are automation's two main gifts."],
          [
            ["Nothing: VLANs cannot be automated", "VLAN changes are a classic automation task."],
            ["It removes the need to test changes", "Automated changes should still be tested, and automation makes testing easier."],
            ["It replaces the switches", "Automation configures the existing switches."],
          ]
        ),
      },
      {
        id: "a-nw-python-basics",
        title: "Python, step 1: print, variables and strings",
        explain:
          "PYTHON is a programming language: you write instructions in a file (a PROGRAM or SCRIPT) and the Python interpreter carries them out from top to bottom. Here, programs run in your browser when you press Run. The first instruction everyone learns is print, which shows something on the screen: print('Hello') shows Hello. Text in quotes is called a STRING. A VARIABLE is a name that stores a value so you can use it later: router = 'R1' stores the string 'R1' under the name router (the = means 'store', not 'equals'). Numbers need no quotes: ports = 24. print can show several things separated by commas, with spaces between them: print(router, 'has', ports, 'ports') shows R1 has 24 ports. An f-STRING puts variables inside text: put f before the opening quote and the variable's name in curly brackets: f'{router} has {ports} ports'. Strings have useful tools called METHODS, written with a dot: hostname.upper() gives the string in capitals. Lines starting with # are COMMENTS, notes for humans that Python ignores. Read the program below line by line, predict exactly what it prints, then run it.",
        codeExercise: {
          language: PY,
          code: py`# Store some facts about a router in variables
router = "R1"
ip = "192.168.1.1"
ports = 4

print("Router:", router)
print(f"{router} has the address {ip}")
print(router, "has", ports, "interfaces")
print(router.lower())
`,
          question: "Follow the four print lines in order. What appears on the screen?",
          expectedOutput: "Router: R1\nR1 has the address 192.168.1.1\nR1 has 4 interfaces\nr1",
          hint: "print with commas puts a space between each item. An f-string replaces {router} and {ip} with their values. .lower() makes the text lowercase.",
          successMessage: "Variables store values; print shows them. Every automation script you ever write is built from these pieces.",
        },
      },
      {
        id: "a-nw-python-lists-loops",
        title: "Python, step 2: lists, loops and decisions",
        explain:
          "A LIST stores several values in order, inside square brackets, separated by commas: routers = ['R1', 'R2', 'R3']. len(routers) gives how many items it has (3). A FOR LOOP repeats some instructions once for each item in a list: for name in routers: is followed by INDENTED lines (four spaces), which run once for each item, with the variable name holding the current item each time. Indentation is how Python knows which lines belong inside the loop, so it matters. An IF statement runs lines only when a condition is true: if status == 'down': (== means 'is equal to', while a single = means 'store'); an optional else: covers the other case. Other comparisons: != (not equal), > and <. You can also build a new list as you go: start with an empty list, results = [], and add items with results.append(item). Predict the output of the program below, which checks a list of interface statuses, then run it.",
        codeExercise: {
          language: PY,
          code: py`statuses = ["up", "up", "down", "up"]
down_count = 0

for status in statuses:
    if status == "down":
        down_count = down_count + 1
        print("Found a down interface")
    else:
        print("ok")

print("Interfaces checked:", len(statuses))
print("Down:", down_count)
`,
          question: "The loop runs once per item in statuses. What does the program print?",
          expectedOutput: "ok\nok\nFound a down interface\nok\nInterfaces checked: 4\nDown: 1",
          hint: "Go through the list in order: up, up, down, up. Only the third item is down. The last two prints run once, after the loop finishes.",
          successMessage: "Loop over a list, decide with if, count what you find: that is the core of most network checks.",
        },
      },
      {
        id: "a-nw-python-functions",
        title: "Python, step 3: functions and the ipaddress module",
        explain:
          "A FUNCTION is a named, reusable block of code. You define it with def, its name, and its PARAMETERS (inputs) in brackets, ending with a colon; the indented lines are its body, and return gives back its result: def usable_hosts(prefix): followed by the indented line return 2 ** (32 - prefix) - 2. (** means 'to the power of', so this is Module 3's 2^h − 2.) You CALL it by name: usable_hosts(26) gives 62. Python also comes with ready-made MODULES. The ipaddress module understands IP addresses: after import ipaddress, net = ipaddress.ip_network('192.168.10.0/26') creates a network object; net.num_addresses gives 64; net.network_address and net.broadcast_address give the network and broadcast addresses; and ipaddress.ip_address('192.168.10.77') in net is True if that address is inside the network. Now write your first function. You will check whether a device's address belongs to a given network, exactly the decision a PC makes with its mask before sending a packet (Module 3).",
        codeChallenge: {
          task: "Write a function in_network(address, network) that returns True if the IP address (a string such as \"192.168.10.77\") is inside the network (a string such as \"192.168.10.64/26\"), and False otherwise. Use the ipaddress module: ip_address(...) in ip_network(...).",
          starter: "import ipaddress\n\ndef in_network(address, network):\n    # turn both strings into ipaddress objects, then test with 'in'\n    pass\n",
          sample: "in_network(\"192.168.10.77\", \"192.168.10.64/26\") → True\nin_network(\"192.168.10.200\", \"192.168.10.64/26\") → False",
          tests: [
            {
              check: py`cases = [
    ("192.168.10.77", "192.168.10.64/26", True),
    ("192.168.10.200", "192.168.10.64/26", False),
    ("10.1.2.3", "10.0.0.0/8", True),
    ("172.32.0.1", "172.16.0.0/12", False),
    ("172.31.255.254", "172.16.0.0/12", True),
]
for address, network, want in cases:
    got = in_network(address, network)
    assert got == want, f"in_network({address!r}, {network!r}) should be {want}, got {got!r}"`,
            },
          ],
          solution: "import ipaddress\n\ndef in_network(address, network):\n    return ipaddress.ip_address(address) in ipaddress.ip_network(network)\n",
          hint: "One line does it: return ipaddress.ip_address(address) in ipaddress.ip_network(network)",
          successMessage: "Your first network function. The same check tells you which subnet any address in a log, a capture or an inventory belongs to.",
        },
      },
      {
        id: "a-nw-python-parse",
        title: "Python, step 4: reading device output",
        explain:
          "Automation scripts often read the TEXT that devices print, such as the show ip interface brief table you know from Module 3, and pull out what matters. Four string tools do most of it. text.splitlines() splits multi-line text into a LIST of lines. line.split() splits one line into a list of WORDS wherever there are spaces. A list's items are numbered from 0, so words[0] is the first word and words[-1] the LAST. And list[1:] means 'everything except the first item', handy for skipping a header line. Applied to one line of the table, 'GigabitEthernet0/3 172.16.5.1 YES manual down down'.split() gives a list whose first item is the interface name and whose last item is the protocol status. In real automation, a library such as Netmiko logs in to the device over SSH and returns this text for you; here the output is given to your function as a string. Write a function that finds every interface whose protocol status (the last column) is not up.",
        codeChallenge: {
          task: "Write down_interfaces(output) that takes the text of show ip interface brief (header line included) and returns a LIST of the names of interfaces whose last column (Protocol) is not \"up\", in the order they appear. For the sample below it returns [\"GigabitEthernet0/2\", \"GigabitEthernet0/3\"].",
          starter: "def down_interfaces(output):\n    result = []\n    lines = output.splitlines()\n    # skip the header line, then for each line:\n    #   split it into words; if the last word is not \"up\", add the first word to result\n    return result\n",
          sample: SHOW_IP_INT_BRIEF,
          tests: [
            {
              check: py`sample = """Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.1.1     YES manual up                    up
GigabitEthernet0/1     10.0.12.1       YES manual up                    up
GigabitEthernet0/2     unassigned      YES unset  administratively down down
GigabitEthernet0/3     172.16.5.1      YES manual down                  down"""
got = down_interfaces(sample)
assert got == ["GigabitEthernet0/2", "GigabitEthernet0/3"], f"Expected ['GigabitEthernet0/2', 'GigabitEthernet0/3'], got {got!r}"
all_up = """Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     10.0.0.1        YES manual up                    up"""
assert down_interfaces(all_up) == [], f"When every interface is up the list should be empty, got {down_interfaces(all_up)!r}"
assert "Interface" not in down_interfaces(sample), "Skip the header line: 'Interface' is a column title, not an interface."`,
            },
          ],
          solution: "def down_interfaces(output):\n    result = []\n    lines = output.splitlines()\n    for line in lines[1:]:\n        words = line.split()\n        if words[-1] != \"up\":\n            result.append(words[0])\n    return result\n",
          hint: "for line in lines[1:]: then words = line.split(); if words[-1] != \"up\": result.append(words[0]).",
          successMessage: "Run that against two hundred routers' output and you have a fleet-wide 'which links are down?' report in seconds. That is network automation.",
        },
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 7 · 10.21 – 10.22
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ad7-ansible-apis",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 7,
    covers: ["10.21", "10.22"],
    title: "Ansible and REST APIs",
    subtitle: "Describing the network you want, and talking to devices programmatically",
    estimatedMinutes: 45,
    intro:
      "Python scripts are one way to automate. Two others are everywhere in industry: Ansible, which applies a described configuration to many devices, and REST APIs, which let programs ask devices and controllers for data and make changes.",

    atoms: [
      {
        id: "a-nw-ansible",
        title: "Ansible introduction",
        explain:
          "ANSIBLE is an open-source automation tool that configures many devices from one control machine. It is AGENTLESS: nothing is installed on the devices; it connects over SSH (or device APIs). You write an INVENTORY, a file listing the devices in groups (for example [access_switches] followed by their names or addresses), and PLAYBOOKS, files in YAML (the indentation-based format you met with netplan in Module 7) that list TASKS to run on a group of hosts. Each task uses a MODULE, for example cisco.ios.ios_vlans to manage VLANs or cisco.ios.ios_config to apply configuration lines. A playbook describes the DESIRED STATE ('VLAN 50 named CCTV exists'), and Ansible makes only the changes needed to reach it: run it twice and the second run changes nothing (this is called IDEMPOTENCE). ansible-playbook followed by the playbook's file name runs it, and the --check option shows what WOULD change without changing anything. A minimal task looks like this, in YAML: a hosts: line naming the group, then tasks:, then a name: describing the task and the module with its settings. Playbooks live in Git, so every change to the network is reviewed and recorded.",
        decision: dec(
          "An Ansible playbook that ensures 'VLAN 50 named CCTV exists on every access switch' is run a second time, an hour after the first run succeeded.",
          "What does Ansible change on the second run?",
          ["Nothing: the VLAN already exists as described, and Ansible only changes what differs from the desired state (idempotence)", "Describing desired state makes repeated runs safe."],
          [
            ["It creates a second VLAN 50 on every switch", "A VLAN number exists once; Ansible would not duplicate it."],
            ["It deletes and recreates the VLAN, briefly disrupting users", "Idempotent modules leave correct configuration alone."],
            ["It fails, because playbooks can only run once", "Playbooks are meant to be run repeatedly."],
          ]
        ),
      },
      {
        id: "a-nw-rest-apis",
        title: "REST APIs and network device management",
        explain:
          "An API (application programming interface) lets one program talk to another. A REST API does it over HTTP (Module 4): a program sends a request to a URL (an ENDPOINT, such as /api/interfaces) with a METHOD that says what to do: GET to read, POST to create, PUT or PATCH to change, DELETE to remove. The device or controller replies with a status code (200 OK, 201 Created, 401 Unauthorized, 404 Not Found) and, usually, data in JSON (JavaScript Object Notation): text made of { } for objects with \"name\": value pairs, and [ ] for lists, which every programming language can read. Modern network devices (through RESTCONF, which uses the YANG data models), SDN controllers, firewalls and every cloud provider are managed through such APIs; requests are authenticated with tokens or keys, always over HTTPS in production. You can call an API from the terminal with curl (Module 4): curl -s followed by the endpoint's address prints the JSON. Piping it into python3 -m json.tool (with |, which sends one command's output into the next, as in Module 7) prints it indented and readable. In the recording, the lab server provides a small JSON endpoint describing a switch's interfaces.",
        terminalExercise: term("m10-api", {
          goal: "Fetch the switch's interface list from http://intranet.lab/api/interfaces.json and print the JSON in a readable, indented form.",
          accept: ["curl -s http://intranet.lab/api/interfaces.json | python3 -m json.tool"],
          near: [
            { command: "curl -s http://intranet.lab/api/interfaces.json", why: "That fetched the JSON, but all squashed together. Pipe it into python3 -m json.tool to indent it." },
          ],
          hint: "curl -s with the address, then | python3 -m json.tool.",
          success: "Each interface is an object with name, status, vlan and description. Notice Gi1/0/3 is down: a script reading this API could raise that alert, exactly as your Python function did with show output.",
        }),
      },
    ],

    requirements: { read: true, video: false, assessment: true },
  },

  /* ═══════════════════════════════════════════════════════════════════
     LESSON 8 · 10.23 – 10.25, 10.P
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: "nw-ad8-professional",
    moduleId: M,
    sectionId: SECTION_ID,
    order: 8,
    covers: ["10.23", "10.24", "10.25", "10.P"],
    title: "Diagrams, Change Management, Careers and the Practical",
    subtitle: "Working as a professional network engineer",
    estimatedMinutes: 45,
    intro:
      "Technical skill gets you hired; professional practice gets you trusted with the network. This lesson covers diagrams, change management and the career paths open to you, then the module's practical.",

    atoms: [
      {
        id: "a-nw-diagrams",
        title: "Professional network diagrams",
        explain:
          "A professional network diagram communicates a design at a glance, and different readers need different VIEWS. A PHYSICAL (Layer 1) diagram shows devices, their locations (building, floor, rack), the cables between them, port numbers and link types (copper, fibre, wireless) and speeds. A LOGICAL (Layer 2 and 3) diagram shows VLANs, subnets, IP addressing, routing domains, trunks, and where firewalls and policy sit, regardless of physical location. A high-level OVERVIEW shows sites, WAN links and the internet edge for managers. Good practice: standard icons (the Cisco icon set or the vendor's own), a TITLE, date, version and author, a LEGEND explaining symbols and line styles, consistent labels (device names, interface names, addresses), boundaries drawn around zones (DMZ, guest, management), and enough white space to read it. Keep diagrams in the documentation system and update them with every change. Tools: draw.io (diagrams.net, free), Microsoft Visio, Lucidchart; NetBox can generate topology from its inventory. The capstone requires both a physical and a logical diagram.",
        decision: dec(
          "A security auditor asks to see which VLANs and subnets can reach the payment servers, and through which firewall.",
          "Which diagram answers that question?",
          ["The logical (Layer 2/3) diagram showing VLANs, subnets, routing and where firewalls enforce policy", "Logical diagrams show traffic relationships and policy points."],
          [
            ["The physical diagram of rack layouts", "Rack layouts show where boxes sit, not which networks can reach which."],
            ["A photo of the wiring closet", "Photos do not show logical paths."],
            ["The office floor plan", "Floor plans show desks, not network policy."],
          ]
        ),
      },
      {
        id: "a-nw-change-management",
        title: "Network documentation and change management",
        explain:
          "Most outages are caused by CHANGES, so professional teams control them. CHANGE MANAGEMENT means every change is: REQUESTED in writing (what, why, which devices, when); ASSESSED for risk and impact (who will be affected, what could go wrong); APPROVED by the right people (often a change advisory board for significant changes, while low-risk 'standard' changes are pre-approved); SCHEDULED in a MAINTENANCE WINDOW when impact is lowest, with users informed; implemented with a tested step-by-step plan, PRE-CHECKS and POST-CHECKS (for example, capture show ip route and show interfaces status before and after); and given a BACK-OUT (rollback) plan in case it fails, with a decision point for using it. Afterwards the change is reviewed and the DOCUMENTATION is updated: diagrams, addressing records and configuration backups. Emergency changes during an incident follow a faster route, but are still recorded and reviewed afterwards. Combined with version control of configurations and automation, this turns the network from a fragile craft into a reliable service.",
        decision: dec(
          "An engineer plans to change the core switches' spanning-tree settings during working hours, without a written plan or a way to undo it, 'because it is a small change'.",
          "What does change management require instead?",
          ["A written, risk-assessed and approved change, scheduled in a maintenance window, with pre- and post-checks and a back-out plan", "Small-looking changes to core devices can cause large outages."],
          [
            ["Nothing: small changes need no process", "Core spanning-tree changes can disrupt the whole network."],
            ["Making the change and telling people only if something breaks", "That is how unplanned outages happen."],
            ["Waiting until the device fails, then changing it", "That is reactive and riskier."],
          ]
        ),
      },
      {
        id: "a-nw-careers",
        title: "Network engineering career paths",
        explain:
          "Networking skills lead to many roles. Entry points: IT SUPPORT or help-desk technician, NOC (network operations centre) technician, and junior network administrator, where you will troubleshoot, patch, monitor and change configurations under supervision. Then NETWORK ADMINISTRATOR or ENGINEER (designing, building and running networks), and specialisms: NETWORK SECURITY engineer (firewalls, VPNs, segmentation, often a path into cybersecurity), WIRELESS engineer, CLOUD NETWORK engineer, DATA-CENTRE engineer, NETWORK AUTOMATION engineer (Python, Ansible, APIs), voice and collaboration engineer, and at the top, NETWORK ARCHITECT. Certifications that employers in Nigeria and worldwide recognise: CompTIA NETWORK+ (vendor-neutral foundations, closely matched by Modules 1 to 9 of this course), Cisco CCNA (the most requested networking certificate), then CCNP and specialist tracks; Juniper's JNCIA; cloud networking certificates from AWS, Microsoft and Google; and security certificates such as CompTIA Security+. Build a PORTFOLIO: your capstone documentation, lab write-ups, scripts on GitHub, and a home lab, and keep learning: networking changes every year.",
        table: {
          caption: "Common certifications on the path.",
          headers: ["Certification", "Level", "Focus"],
          rows: [
            ["CompTIA Network+", "Entry", "Vendor-neutral networking foundations"],
            ["Cisco CCNA", "Associate", "Switching, routing, wireless, security basics, automation basics"],
            ["Juniper JNCIA-Junos", "Associate", "Junos networking"],
            ["CompTIA Security+", "Entry", "Security foundations"],
            ["Cisco CCNP Enterprise", "Professional", "Advanced enterprise networking"],
            ["AWS Advanced Networking / Azure Network Engineer", "Specialist", "Cloud networking"],
          ],
        },
        decision: dec(
          "A graduate of this course wants their first networking job and asks which certificate to take first to show employers vendor-neutral foundations, before specialising in Cisco equipment.",
          "Which is the usual first choice?",
          ["CompTIA Network+, followed by Cisco CCNA", "Network+ proves foundations; CCNA proves practical Cisco skills employers request."],
          [
            ["CCNP straight away", "CCNP is professional level and assumes CCNA knowledge and experience."],
            ["An advanced cloud specialist certificate", "Specialist certificates assume strong foundations first."],
            ["No certificate is ever useful", "Recognised certificates help, especially for a first job."],
          ]
        ),
      },
    ],

    requirements: { read: true, video: false, assessment: true },

    task: {
      title: "Module 10 practical: enterprise, cloud, containers and automation",
      intro:
        "This practical prepares directly for the capstone. Use free tiers and free tools only: draw.io for diagrams, a cloud free tier (and delete everything afterwards so nothing is billed), Docker Desktop or Docker on your Ubuntu VM, and Python.",
      prompts: [
        "Design a multi-department enterprise network for a three-floor building: a hierarchical (or collapsed-core) design with redundancy, VLANs per department, and an internet edge with a DMZ. Draw both a physical and a logical diagram.",
        "Explore a cloud VPC: create one with a public and a private subnet in two availability zones, look at their route tables, add a security group allowing only HTTPS, then delete it all.",
        "Build a simple Docker network: create a user-defined bridge, run two containers on it, and show that they reach each other by name; then publish one container's port to the host.",
        "Automate a basic network check with Python: given a list of IP addresses and a network, report which addresses are inside it, and extend down_interfaces() to report the interface's IP address too.",
        "Produce professional documentation for your design: addressing plan, VLAN table, device list, a change request for adding a new department, and a back-out plan.",
      ],
      closing:
        "You have learned the whole discipline. The capstone puts it together: you will design, build, secure, test and document an enterprise network for a real-sized organisation.",
    },
  },
];
