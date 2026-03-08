import Map "mo:core/Map";
import Order "mo:core/Order";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";

actor {
  type Contact = {
    name : Text;
    email : Text;
    service : Text;
    message : Text;
  };

  type PortfolioItem = {
    title : Text;
    category : Text;
    description : Text;
    imageUrl : Text;
  };

  type Service = {
    name : Text;
    description : Text;
    icon : Text;
  };

  type PricingPlan = {
    name : Text;
    price : Float;
    features : [Text];
    recommended : Bool;
  };

  type Admin = Principal;
  // TODO: switch to testnet deployer principal
  let admin : Admin = Principal.fromText("2vxsx-fae");

  let contacts = List.empty<Contact>();

  module Contact {
    public func compare(contact1 : Contact, contact2 : Contact) : Order.Order {
      Text.compare(contact1.email, contact2.email);
    };
  };

  let portfolioMap = Map.empty<Text, PortfolioItem>();

  module PortfolioItem {
    public func compare(portfolio1 : PortfolioItem, portfolio2 : PortfolioItem) : Order.Order {
      Text.compare(portfolio1.title, portfolio2.title);
    };
  };

  let serviceMap = Map.empty<Text, Service>();

  module Service {
    public func compare(service1 : Service, service2 : Service) : Order.Order {
      Text.compare(service1.name, service2.name);
    };
  };

  let pricingMap = Map.empty<Text, PricingPlan>();

  module PricingPlan {
    public func compare(plan1 : PricingPlan, plan2 : PricingPlan) : Order.Order {
      Float.compare(plan1.price, plan2.price);
    };
  };

  public shared ({ caller }) func submitContact(name : Text, email : Text, service : Text, message : Text) : async () {
    let contact : Contact = {
      name;
      email;
      service;
      message;
    };
    contacts.add(contact);
  };

  public query ({ caller }) func getAllContacts() : async [Contact] {
    contacts.toArray().sort();
  };

  public query ({ caller }) func getAllPortfolioItems() : async [PortfolioItem] {
    portfolioMap.values().toArray().sort();
  };

  public query ({ caller }) func getAllServices() : async [Service] {
    serviceMap.values().toArray().sort();
  };

  public query ({ caller }) func getAllPricingPlans() : async [PricingPlan] {
    pricingMap.values().toArray().sort();
  };

  public shared ({ caller }) func addPortfolioItem(title : Text, category : Text, description : Text, imageUrl : Text) : async () {
    onlyAdmin(caller);
    let item : PortfolioItem = {
      title;
      category;
      description;
      imageUrl;
    };
    portfolioMap.add(title, item);
  };

  public shared ({ caller }) func addService(name : Text, description : Text, icon : Text) : async () {
    onlyAdmin(caller);
    let service : Service = {
      name;
      description;
      icon;
    };
    serviceMap.add(name, service);
  };

  public shared ({ caller }) func addPricingPlan(name : Text, price : Float, features : [Text], recommended : Bool) : async () {
    onlyAdmin(caller);
    let plan : PricingPlan = {
      name;
      price;
      features;
      recommended;
    };
    pricingMap.add(name, plan);
  };

  public shared ({ caller }) func updatePortfolioItem(title : Text, category : Text, description : Text, imageUrl : Text) : async () {
    onlyAdmin(caller);
    let item : PortfolioItem = {
      title;
      category;
      description;
      imageUrl;
    };
    portfolioMap.add(title, item);
  };

  public shared ({ caller }) func updateService(name : Text, description : Text, icon : Text) : async () {
    onlyAdmin(caller);
    let service : Service = {
      name;
      description;
      icon;
    };
    serviceMap.add(name, service);
  };

  public shared ({ caller }) func updatePricingPlan(name : Text, price : Float, features : [Text], recommended : Bool) : async () {
    onlyAdmin(caller);
    let plan : PricingPlan = {
      name;
      price;
      features;
      recommended;
    };
    pricingMap.add(name, plan);
  };

  public shared ({ caller }) func deletePortfolioItem(title : Text) : async () {
    onlyAdmin(caller);
    portfolioMap.remove(title);
  };

  public shared ({ caller }) func deleteService(name : Text) : async () {
    onlyAdmin(caller);
    serviceMap.remove(name);
  };

  public shared ({ caller }) func deletePricingPlan(name : Text) : async () {
    onlyAdmin(caller);
    pricingMap.remove(name);
  };

  public shared ({ caller }) func seedData() : async () {
    onlyAdmin(caller);

    let portfolioItems = [
      {
        title = "E-commerce Website";
        category = "Web Development";
        description = "A responsive e-commerce platform for online retail.";
        imageUrl = "https://example.com/img/ecommerce.jpg";
      },
      {
        title = "Brand Identity";
        category = "Design";
        description = "Complete branding package for a startup.";
        imageUrl = "https://example.com/img/brand.jpg";
      },
      {
        title = "Mobile App";
        category = "App Development";
        description = "Cross-platform mobile app for food delivery.";
        imageUrl = "https://example.com/img/mobile.jpg";
      },
    ];

    let services = [
      {
        name = "Web Design";
        description = "Custom website design and development.";
        icon = "web";
      },
      {
        name = "Graphic Design";
        description = "Logos, branding, and marketing materials.";
        icon = "design";
      },
      {
        name = "SEO Optimization";
        description = "Improve your website's search engine ranking.";
        icon = "seo";
      },
    ];

    let pricingPlans = [
      {
        name = "Basic";
        price = 199.0;
        features = ["1 Website", "Basic SEO", "5 Pages"];
        recommended = false;
      },
      {
        name = "Standard";
        price = 399.0;
        features = ["3 Websites", "Advanced SEO", "10 Pages"];
        recommended = true;
      },
      {
        name = "Premium";
        price = 799.0;
        features = ["Unlimited Websites", "Full SEO Suite", "Unlimited Pages"];
        recommended = false;
      },
    ];

    for (item in portfolioItems.values()) {
      portfolioMap.add(item.title, item);
    };

    for (service in services.values()) {
      serviceMap.add(service.name, service);
    };

    for (plan in pricingPlans.values()) {
      pricingMap.add(plan.name, plan);
    };
  };

  func onlyAdmin(caller : Principal) {
    if (caller != admin) {
      Runtime.trap("Only admin can perform this action");
    };
  };
};
