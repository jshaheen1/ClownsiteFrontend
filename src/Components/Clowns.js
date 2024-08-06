import React, { useState, useEffect, useRef } from 'react';
import * as Plot from "@observablehq/plot";
import * as d3 from 'd3';
import authHeader from '../Functions/AuthHeader';

const Clowns = () => {
  const [clowns, setClowns] = useState([]);
  const [name, setName] = useState('');
  const [skill, setSkill] = useState('');
  const [yrsofservice, setYrsOfService] = useState('');
  const [nameValid, setNameValid] = useState(true);
  const [skillValid, setSkillValid] = useState(true);
  const [yrsofserviceValid, setYrsOfServiceValid] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const containerRef = useRef();

  const validateName = (name) => /^[a-zA-Z\s]*$/.test(name);
  const validateYrsOfService = (yrs) => (/^\d+$/.test(yrs) && Number(yrs) <= 100);
  const validateSkill = (skill) => /^[a-zA-Z\s]*$/.test(skill);

  useEffect(() => {
    fetchClowns();
  }, []);

  const fetchClowns = async () => {
    const response = await fetch('http://localhost:8080/clowns', {headers:{ ...authHeader()}});
    const data = await response.json();
    setClowns(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormSubmitted(true);

    if (!nameValid || !yrsofserviceValid || !skillValid) {
      return;
    }

    setErrorMsg('');

    const newClown = { name, skill, yrsofservice };
    try {
      const response = await fetch('http://localhost:8080/clowns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          headers:{ ...authHeader()}
        },
        body: JSON.stringify(newClown),
      });
      if (!response.ok) {
        throw new Error("Unable to save clown");
      }
      fetchClowns(); // Refresh the clown list after adding a new one
      setName('');
      setSkill('');
      setYrsOfService('');
      setFormSubmitted(false);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleDeleteClown = (clownId) => {
    fetch(`http://localhost:8080/clowns/${clownId}`, {
      method: 'DELETE',
      headers:{ ...authHeader()}
    })
      .then(response => {
        if (response.ok) {
          setClowns(prevClowns => prevClowns.filter(clown => clown.id !== clownId));
        } else {
          console.error('Failed to delete clown');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameValid(validateName(value));
  };

  const handleSkillChange = (e) => {
    const value = e.target.value;
    setSkill(value);
    setSkillValid(validateSkill(value));
  };

  const handleYrsOfServiceChange = (e) => {
    const value = e.target.value;
    setYrsOfService(value);
    setYrsOfServiceValid(validateYrsOfService(value));
  };

  useEffect(() => {
    if (clowns.length === 0) return;

    const maxYrsOfService = d3.max(clowns, d => d.yrsofservice);
    const thresholds = d3.range(0, maxYrsOfService + 4, 2);

    const bins = d3.bin().thresholds(thresholds).value(d => d.yrsofservice)(clowns);
    const maxFrequency = d3.max(bins, d => d.length);

    const currentContainer = containerRef.current;

    if (currentContainer) {
      const plot = Plot.plot({
        marks: [
          Plot.rectY(clowns, Plot.binX({ y: "count", thresholds }, { x: "yrsofservice", fill: "skill" })),
          Plot.ruleY([0])
        ],
        color: {
          legend: true
        },
        x: {
          label: "Years of Service",
          ticks: thresholds
        },
        y: {
          label: "Frequency",
          ticks: maxFrequency,
          tickFormat: d3.format("d")
        }
      });

      currentContainer.append(plot);

      return () => {
        d3.select(currentContainer).selectAll("*").remove();
      };
    }
  }, [clowns]);

  const userRole = localStorage.getItem("userRole");

  return (
    <div className="clowns-container">
      <div className="table-container">
        <h2>Clowns</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Skill</th>
              <th>Years of Service</th>
            </tr>
          </thead>
          <tbody>
            {clowns.map((clown) => (
              <tr key={clown.id}>
                <td>{clown.name}</td>
                <td>{clown.skill}</td>
                <td>{clown.yrsofservice}</td>
                <td>
                  <button style={{ marginLeft: '10px' }} onClick={() => handleDeleteClown(clown.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(userRole === "ADMIN" || userRole === "ME") && (
        <div className="form-container">
          <h2>Add Clown</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={name}
                maxLength={255}
                onChange={handleNameChange}
                style={{ borderColor: !nameValid && formSubmitted ? 'red' : '' }}
                required
              />{!nameValid && formSubmitted && <span style={{ color: 'red' }}>Name must contain only letters and spaces.</span>}
            </div>
            <div>
              <label>Skill:</label>
              <input
                type="text"
                value={skill}
                maxLength={255}
                minLength={1}
                onChange={handleSkillChange}
                style={{ borderColor: !skillValid && formSubmitted ? 'red' : '' }}
                required
              />{!skillValid && formSubmitted && <span style={{ color: 'red' }}>Skill must contain only letters and spaces.</span>}
            </div>
            <div>
              <label>Years of Service:</label>
              <input
                type="number"
                value={yrsofservice}
                max={100}
                onChange={handleYrsOfServiceChange}
                style={{ borderColor: !yrsofserviceValid && formSubmitted ? 'red' : '' }}
                required
              />{!yrsofserviceValid && formSubmitted && <span style={{ color: 'red' }}>Years of service must be a number between 0 and 100.</span>}
            </div>
            <button type="submit">Add Clown</button>
            <div>{errorMsg.includes("save") && errorMsg}</div>
          </form>
        </div>
      )}
      <div>
        <h1>Clowns by Years of Service</h1>
        <div ref={containerRef} />
      </div>
    </div>
  );
};

export default Clowns;
