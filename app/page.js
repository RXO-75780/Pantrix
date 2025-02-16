"use client";
import { useState, useEffect } from "react";
import { firestone, firestore } from "@/firebase.js";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  Stack,
  InputBase,
  Paper,
  Link,
  IconButton,
  InputAdornment,
  SearchIcon,
} from "@mui/material";
import {
  doc,
  collection,
  query,
  getDocs,
  deleteDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import AuthPage from "@/authPage.js";

export default function Home() {
  const [Inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("User signed up successfully");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("User signed in successfully");
      }
      router.push("/dashboard"); // Redirect to the dashboard or another protected route
    } catch (error) {
      console.error("Authentication error:", error.message);
    }
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };
  useEffect(() => {
    updateInventory();
  }, []);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInventory = Inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h2" color="#000000" gutterBottom>
        Pantrix
      </Typography>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack
        width="100vw"
        height="100px"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingLeft="100px"
      >
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "60%",
            height: "100%",
            marginBottom: 2,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Inventory"
            inputProps={{ "aria-label": "search inventory" }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Paper>
        <Button
          variant="contained"
          onClick={() => {
            handleOpen();
          }}
        >
          Add new Item
        </Button>
      </Stack>
      <Box border="1px solid #333">
        <Typography variant="h2" color="#333">
          Inventory Items
        </Typography>
      </Box>
      <Stack width="100vw" height="100vh" spacing={2} overflow="auto">
        {filteredInventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#f0f0f0"
            padding={5}
          >
            <Typography variant="h3" color="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h3" color="#333" textAlign="center">
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => {
                  addItem(name);
                }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  removeItem(name);
                }}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
