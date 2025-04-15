// src/pages/OptimizationPage.tsx
import React, { useState, useEffect } from 'react';
import { Gql, ValueTypes } from '../zeus';

interface JobStatusType {
  state: string;
  message?: string | null;
}

const OptimizationPage: React.FC = () => {
  const [jobId, setJobId] = useState<number | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatusType | null>(null);
  const [jobOutcome, setJobOutcome] = useState<any>(null);
  const [resultNames, setResultNames] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const [country, setCountry] = useState<string>('');
  const [place, setPlace] = useState<string>('');

  const handleStartOptimization = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const updateSettingsMutation = {
        updateSettings: [
          { settingsInput: { location: { country, place } } },
          {
            __typename: true,
            "...on Settings": { location: { country: true, place: true } },
            "...on ValidationErrors": { errors: { field: true, message: true } }
          }
        ] as [
          { settingsInput: ValueTypes["SettingsInput"] },
          ValueTypes["SettingsResult"]
        ]
      };
      const updateResponse = await Gql('mutation')(updateSettingsMutation);
      if (updateResponse.updateSettings.__typename === 'ValidationErrors') {
        setError('Update settings failed.');
        return;
      }
    } catch (err) {
      setError(`Error updating settings: ${err}`);
      return;
    }

    // Save model on disk as part of starting the optimization job
    try {
      const saveMutation = {
        saveModel: { message: true, __typename: true }
      };
      const saveResponse = await Gql('mutation')(saveMutation);
      if (saveResponse.saveModel && saveResponse.saveModel.message) {
        setError(`Save Model Error: ${saveResponse.saveModel.message}`);
        return;
      }
    } catch (err) {
      setError(`Error saving model: ${err}`);
      return;
    }

    try {
      const startOptMutation = {
        startOptimization: true
      };
      const startOptResponse = await Gql('mutation')(startOptMutation);
      setJobId(startOptResponse.startOptimization);
    } catch (err) {
      setError(`Error starting optimization: ${err}`);
    }
  };

  // New function to save the model on disk
  const handleSaveModel = async () => {
    setError('');
    try {
      const saveMutation = {
        saveModel: { message: true, __typename: true }
      };
      const saveResponse = await Gql('mutation')(saveMutation);
      if (saveResponse.saveModel && saveResponse.saveModel.message) {
        setError(`Save Model Error: ${saveResponse.saveModel.message}`);
      } else {
        alert("Model saved successfully.");
      }
    } catch (err) {
      setError(`Error saving model: ${err}`);
    }
  };

  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(async () => {
      try {
        const statusQuery = {
          jobStatus: [
            { jobId },
            { state: true, message: true }
          ] as [
            { jobId: number },
            { state: true, message: true }
          ]
        };
        const statusResponse = await Gql('query')(statusQuery);
        setJobStatus(statusResponse.jobStatus);

        if (
          statusResponse.jobStatus.state === 'FINISHED' ||
          statusResponse.jobStatus.state === 'FAILED'
        ) {
          clearInterval(interval);
          const outcomeQuery = {
            jobOutcome: [
              { jobId },
              {
                __typename: true,
                "...on OptimizationOutcome": {
                  controlSignals: {
                    name: true,
                    signal: true
                  }
                }
              }
            ] as [
              { jobId: number },
              any
            ]
          };
          const outcomeResponse = await Gql('query')(outcomeQuery);
          setJobOutcome(outcomeResponse.jobOutcome);

          if (
            outcomeResponse.jobOutcome &&
            outcomeResponse.jobOutcome.__typename === "OptimizationOutcome" &&
            "controlSignals" in outcomeResponse.jobOutcome
          ) {
            const outcome = outcomeResponse.jobOutcome as {
              controlSignals: { name: string; signal: number[] }[];
            };
            const names = outcome.controlSignals.map((signal) => signal.name);
            setResultNames(names);
          }          
        }
      } catch (err) {
        console.error('Error fetching job status:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [jobId]);

  const handleFetchOutcome = async () => {
    if (!jobId) return;
    try {
      const outcomeQuery = {
        jobOutcome: [
          { jobId },
          {
            __typename: true,
            "...on OptimizationOutcome": {
              controlSignals: {
                name: true,
                signal: true
              }
            }
          }
        ] as [
          { jobId: number },
          any
        ]
      };
      const outcomeResponse = await Gql('query')(outcomeQuery);
      setJobOutcome(outcomeResponse.jobOutcome);

      if (
        outcomeResponse.jobOutcome &&
        outcomeResponse.jobOutcome.__typename === "OptimizationOutcome" &&
        "controlSignals" in outcomeResponse.jobOutcome
      ) {
        const outcome = outcomeResponse.jobOutcome as {
          controlSignals: { name: string; signal: number[] }[];
        };
        const names = outcome.controlSignals.map((signal) => signal.name);
        setResultNames(names);
      }      
    } catch (err) {
      console.error('Error fetching optimization outcome:', err);
    }
  };

  const handleExportCSV = () => {
    if (!jobOutcome || jobOutcome.__typename !== "OptimizationOutcome") return;
  
    const signals = jobOutcome.controlSignals;
    const timeSteps = signals[0].signal.length;
  
    // Header: first column is "Time", then one for each signal name
    const headers = ["Time", ...signals.map((s: any) => s.name)];
  
    // Rows: one row per timestep
    const rows = Array.from({ length: timeSteps }, (_, i) => {
      const row = [i]; // time index
      signals.forEach((s: any) => {
        row.push(s.signal[i]);
      });
      return row;
    });
  
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `optimization_results_job_${jobId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Optimization Page</h1>
      <form onSubmit={handleStartOptimization}>
        <fieldset>
          <legend>Location Settings</legend>
          <label>
            Country:
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Place:
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
            />
          </label>
        </fieldset>
        <br />
        <button type="submit">
          Update Settings, Save Model &amp; Start Optimization
        </button>
      </form>

      {/* New button for saving the model on disk */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSaveModel}>
          Save Model on Disk
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {jobId && (
        <div>
          <p>Optimization Job Started. Job ID: {jobId}</p>
        </div>
      )}

      {jobStatus && (
        <div>
          <h2>Job Status</h2>
          <p>Job ID: {jobId}</p>
          <p>State: {jobStatus.state}</p>
          {jobStatus.message && <p>Message: {jobStatus.message}</p>}
        </div>
      )}

      {jobId && !jobOutcome && (
        <div>
          <p>Fetching results for Job ID: {jobId}</p>
          <button onClick={handleFetchOutcome}>
            Fetch Optimization Results
          </button>
        </div>
      )}

      {resultNames.length > 0 && (
        <div>
          <h3>Result Signal Names</h3>
          <ul>
            {resultNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      {jobOutcome && (
        <div>
          <h2>Job Outcome</h2>
          <button onClick={handleExportCSV}>Download CSV</button>
          <p>Results for Job ID: {jobId}</p>
          <pre>{JSON.stringify(jobOutcome, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default OptimizationPage;
