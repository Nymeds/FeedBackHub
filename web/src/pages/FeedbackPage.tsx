import React from "react";
import TopBar from "../components/TopBar";
import MainCard from "../components/MainCard";
import BottomBar from "../components/BottomBar";

export default function FeedbackPage() {
return (
<div className="fp-root">
<div className="fp-container">
<TopBar />
<MainCard />
<BottomBar />
</div>
</div>
);
}