// src/ui/ViewRaindrops.tsx

import * as React from "react";
import RTOPlugin from 'main'
import { App, normalizePath, Notice, TFile, TFolder, Vault, Modal } from "obsidian";
import { getRaindrop, getRaindrops, updateRaindropCollection, buildNote, archiveRaindrop, getTags, filterRaindrops } from '../utils';


// import 'RaindropCard' from './RaindropCard'


export default function ViewRaindrops(): JSX.Element {
  const [raindrops, setRaindrops] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [unsortedRaindropCount, setUnsortedRaindropCount] = React.useState(0);

  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [value, setValue] = React.useState("Tags (0)");

  async function loadRaindropList(){
    setLoading(true);
    // TODO - move to a utility function
    const pluginSettings = window.app.plugins.plugins['raindropio-to-obsidian'].settings;
    // console.log('Find Plugin Settings', pluginSettings)
    let bearerToken = pluginSettings.bearerToken || '';
    // fetch the list of raindrops
    const result = await getRaindrops('-1', bearerToken);
    // console.log('here from load raindrop list', result)

    const tags = await getTags('-1', bearerToken);
    console.log('here from load tags', tags)
    let itemChoices = [];
    tags.forEach(tag => {
      // console.log('tag', tag)
      itemChoices.push({ label: `${tag['_id']} (${tag['count']})`, value: tag['_id'] })
    }
    // console.log('itemChoices', itemChoices)
    setItems(itemChoices);
    // tags.map(({ tag }) => ( console.log('tag', tag) ) );
    setRaindrops(result)
    // console.log('raindrops', result)
    setUnsortedRaindropCount(88)
    setLoading(false);
    return {};
  }

  async function handleFilterRaindrops(){
    setLoading(true);
    console.log('filtering raindrops for tag', value)
    // TODO - move to a utility function
    const pluginSettings = window.app.plugins.plugins['raindropio-to-obsidian'].settings;
    // console.log('Find Plugin Settings', pluginSettings)
    let bearerToken = pluginSettings.bearerToken || '';
    // fetch the list of raindrops
    const result = await filterRaindrops('-1', bearerToken, value);
    // console.log('here from load filter list', result)
    setRaindrops(result)
    // // console.log('raindrops', result)
    setUnsortedRaindropCount(88)
    setLoading(false);
    // return {};
  }

  async function createRaindropNote(raindrop: Object): Promise<TFile> {
    // TODO - move to a utility function
    // Get the plugin settings and bearer token
    const pluginSettings = window.app.plugins.plugins['raindropio-to-obsidian'].settings;
    // console.log('Find Plugin Settings', pluginSettings)
    let bearerToken = pluginSettings.bearerToken || '';

    // Create the note
    try {
      // fetch raindrop
      const currentRaindrop = await getRaindrop(raindrop._id, bearerToken);
      // Create the file
      const note = await buildNote(currentRaindrop);
      return note;
    } catch (error) {
      new Notice(error.message)
      // // set the button as loading
      // button.setButtonText('Download Tweet')
      // button.setDisabled(false)
      return
    }
  }

  const mystyle = {
    card:  {
      boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
      backgroundColor: "white",
      color: "black",
      padding: "12px 16px",
      transition: "0.3s",
      borderRadius: "5px", /* 5px rounded corners */
      fontSize: "12px",
    }
  };
  
  const renderRaindrop = (raindrop:Object) => (
    <div style={{padding: "3px"}}>
      <div style={mystyle.card}>
        <p>
          <img src={raindrop.cover} width="100" height="100" alt="Image" style={{ float: "left", marginRight: "10px" }} /> 
          {raindrop.title} - {raindrop.excerpt.replace(/(.{280})..+/, "$1…")}
        </p>
      
        <p>View Here -> <a target="_blank" rel="noopener noreferrer" href={raindrop.link}>Link</a></p>
        <hr />
        <p>Tags: </p>
        <ul>
          {raindrop.tags.map((tag:string) => (
            <li key={tag}>#[[{tag}]]</li>
          ))}
        </ul>
       <p>
        <button onClick={() => createRaindropNote(raindrop)} style={{padding: "3px"}}>
          Create Raindrop Note
        </button> 
        <button onClick={() => archiveRaindrop(raindrop)} style={{padding: "3px"}}>
          Archive Raindrop
        </button> 
      </p>
      </div>
    </div>
  );

  return (
    <>
      <div>
        <p>Sync Raindrop</p>
        <h5>Raindrops Found - {unsortedRaindropCount}</h5> 
        <button onClick={() => loadRaindropList()}>
         Sync Raindrop
        </button>
      </div>
      <hr></hr>

      {loading ? ( <p> <img src="https://images.squarespace-cdn.com/content/v1/5c4a3053b98a78bea1e90622/1575486969836-DQKSYYW7F60712AGPFKV/loader.gif?format=1000w" alt="" width="48" height="48" /></p> ) : (
        <>
          {raindrops.length > 0 && (
            <div>
              <p>Select a Tag to filter by</p>
              <select
                disabled={loading}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
              >
                {items.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button onClick={() => handleFilterRaindrops()} style={{padding: "3px"}}>
                Filter Raindrops
              </button> 
            </div>
          )}
          <div>
            {raindrops.map((raindrop) => renderRaindrop(raindrop))}
          </div>
        </>
      )}
    </>
  );
}
