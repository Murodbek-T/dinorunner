import { Button, Card, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { FaShop, FaBitcoinSign, FaBone, FaBars } from "react-icons/fa6";
import Shop from "./Shop";
import { coins } from "../lib/currencies";
import CoinsDisplay from "./CoinDisplay";

const Buttons = () => {
  const [shopModal, setShopModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Card>
          <Card.Body className="flex items-center gap-2 font-semibold h-10">
            <FaBitcoinSign />
            <CoinsDisplay />
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="flex items-center gap-2 font-semibold h-10 font-mono">
            <FaBone /> Score: <span className="score text-lg">0</span>
          </Card.Body>
        </Card>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="primary" onClick={() => setShopModal(true)}>
          <div className="flex items-center gap-2">
            <FaShop /> Skin Shop
          </div>
        </Button>
        <Modal
          show={shopModal}
          onHide={() => setShopModal(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Skin Shop</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Shop />
          </Modal.Body>
        </Modal>

        <Button variant="info" onClick={() => setShowMenu(true)}>
          <FaBars size={24} color="white" />
        </Button>
        <Modal
          show={showMenu}
          onHide={() => setShowMenu(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Skin Shop</Modal.Title>
          </Modal.Header>
          <Modal.Body>Menu</Modal.Body>
          <Modal.Footer>skin shop bebe</Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Buttons;
