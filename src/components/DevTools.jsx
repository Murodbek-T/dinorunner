import { Button, Toast, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";

const DevTools = () => {
  const [devToast, setDevToast] = useState(false);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  const [startCoins, setStartCoins] = useState(0);
  const [godMode, setGodMode] = useState(false);
  const [unlimitedCoins, setUnlimitedCoins] = useState(false);

  const handleApplyChanges = () => {
    if (window.updateScoreMultiplier) {
      window.updateScoreMultiplier(scoreMultiplier);
    }

    if (startCoins > 0 && window.addCoins) {
      window.addCoins(startCoins);
    }

    if (window.setGodMode) {
      window.setGodMode(godMode);
    }

    if (unlimitedCoins && window.setUnlimitedCoins) {
      window.setUnlimitedCoins();
    }

    setDevToast(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setDevToast(true)}>
        🛠 Dev Tools
      </Button>

      <Toast
        className="w-full"
        show={devToast}
        onClose={() => setDevToast(false)}
      >
        <Toast.Header className="flex items-center justify-between">
          <strong>🎮 Dev Tools</strong>
        </Toast.Header>
        <Toast.Body className="w-full">
          <div className="space-y-3">
     
            <Form.Group>
              <Form.Label>⚡ Score Multiplier: {scoreMultiplier}x</Form.Label>
              <Form.Range
                min="1"
                max="100"
                value={scoreMultiplier}
                onChange={(e) => setScoreMultiplier(Number(e.target.value))}
              />
            </Form.Group>

 
            <Form.Group>
              <Form.Label>💰 Starting Coins</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={startCoins}
                  onChange={(e) => setStartCoins(Number(e.target.value))}
                  placeholder="Enter coin amount"
                />
              </InputGroup>
            </Form.Group>

    
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="🛡️ God Mode (Invincible)"
                checked={godMode}
                onChange={(e) => setGodMode(e.target.checked)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="∞ Unlimited Coins (9,999,999)"
                checked={unlimitedCoins}
                onChange={(e) => setUnlimitedCoins(e.target.checked)}
              />
            </Form.Group>

         
            <Button
              variant="success"
              onClick={handleApplyChanges}
              className="w-full"
            >
              🚀 Apply Changes
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default DevTools;
