import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Changelog() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/tracker");
  }, [setLocation]);
  return null;
}
