import React, { useEffect, useState } from "react";
import { SKINS } from "../data/skins";
import { useSkin } from "./SkinContext";
import { Card, Button, Row, Col, Container, Tabs, Tab } from "react-bootstrap";
import { useCoins, _coins, spendCoins } from "../lib/currencies";

const Shop = () => {
  const {
    skin,
    activeDino,
    activeGround,
    activeCactus,
    setDinoSkin,
    setGroundSkin,
    setCactusSkin,
  } = useSkin();

  const [currentCoins] = useCoins()
  const [owned, setOwned] = useState({
    dino: ["default"],
    ground: ["default"],
    cactus: ["default"],
  });

  const prices = {
    default: 0,
    batman: 1,
    joker: 1,
    mario: 1,
    ninja: 1,
    pacman: 1,
    premium: 1,
    sonic: 1,
    supersonic: 1,
  };




  const handleBuy = (type, name, price) => {
    if (!spendCoins(price)) return alert("Not enough coins!");

    setOwned((prev) => ({
      ...prev,
      [type]: [...prev[type], name],
    }));
  };


  const handleActivate = (type, name) => {
    if (type === "dino") setDinoSkin(name);
    if (type === "ground") setGroundSkin(name);
    if (type === "cactus") setCactusSkin(name);
  };

  const renderTab = (type) => {
    return (
      <Row xs={1} sm={2} md={2} lg={2} className="g-4">
        {Object.entries(SKINS).map(([name, data]) => {
          const price = prices[name] || 0;
          const ownedSkin = owned[type].includes(name);
          const isActive =
            (type === "dino" && activeDino === name) ||
            (type === "ground" && activeGround === name) ||
            (type === "cactus" && activeCactus === name);

          const previewImg =
            type === "dino"
              ? data.dino
              : type === "ground"
              ? data.ground
              : data.cactus1;

          return (
            <Col key={name}>
              <Card
                border={isActive ? "warning" : "secondary"}
                className="shadow-sm h-100"
              >
                <Card.Img
                  variant="top"
                  src={previewImg}
                  alt={name}
                  style={{ height: "160px", objectFit: "contain" }}
                />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="text-capitalize fw-semibold">
                      {name}
                    </Card.Title>
                    <Card.Text className="text-muted mb-2">
                      {price === 0 ? "Free" : `${price} coins`}
                    </Card.Text>
                  </div>

                  {ownedSkin ? (
                    <Button
                      variant={isActive ? "warning" : "success"}
                      onClick={() => handleActivate(type, name)}
                    >
                      {isActive ? "Active" : "Activate"}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => handleBuy(type, name, price)}
                    >
                      Buy
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <Container className="py-5 text-center">
      <h1 className="mb-4 fw-bold">🛒 Dino Skin Shop</h1>
      <h5 className="mb-5 text-secondary">💰 Coins: {currentCoins}</h5>

      <Tabs defaultActiveKey="dino" id="skin-tabs" className="mb-4">
        <Tab eventKey="dino" title="Dino">
          {renderTab("dino")}
        </Tab>
        <Tab eventKey="ground" title="Ground">
          {renderTab("ground")}
        </Tab>
        <Tab eventKey="cactus" title="Cactus">
          {renderTab("cactus")}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Shop;
