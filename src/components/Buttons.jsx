import { Button, Card, Modal, Toast } from "react-bootstrap";
import React, { useState } from "react";
import {
  FaShop,
  FaBitcoinSign,
  FaBone,
  FaBars,
  FaGlobe,
  FaTwitter,
  FaTelegram,
} from "react-icons/fa6";
import Shop from "./Shop";
import CoinsDisplay from "./CoinDisplay";
import DevTools from "./DevTools";

const buttons = [
  {
    id: 1,
    content: "💌 Referals",
    variant: "success",
  },
  {
    id: 2,
    content: "🔁 Exchange",
    variant: "warning",
  },
  {
    id: 3,
    content: "💸 Withdraw",
    variant: "danger",
  },
  {
    id: 4,
    content: "☀ Theme",
    variant: "dark",
  },
];

const links = [
  {
    id: 1,
    link: "link-to-somewhere",
    icon: <FaTelegram />,
    title: "Telegram",
  },
  {
    id: 2,
    link: "link-to-somewhere",
    icon: <FaTwitter />,
    title: "Twitter",
  },
  {
    id: 3,
    link: "https://www.playdino.fun",
    icon: <FaGlobe />,
    title: "Website",
  },
];

const Buttons = () => {
  const [shopModal, setShopModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Toast
  const [devToast, setDevToast] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Card>
          <Card.Body className="flex items-center gap-2 font-semibold h-10">
            <FaBitcoinSign />
            <CoinsDisplay />
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
            <Modal.Title>Menu</Modal.Title>
          </Modal.Header>
          <Modal.Body className="w-full flex flex-col items-center gap-3">
            <div className="w-full grid grid-cols-1 gap-3">
              {buttons.map((button) => (
                <Button
                  key={button.id}
                  className="h-14"
                  variant={`${button.variant}`}
                >
                  {button.content}
                </Button>
              ))}
            </div>
            <div className="flex gap-5">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.link}
                  className="no-underline flex items-center gap-2"
                >
                  {link.icon}
                  {link.title}
                </a>
              ))}
            </div>

           <DevTools />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Buttons;
