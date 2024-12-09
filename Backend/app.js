import jwt from 'jsonwebtoken';
import mysql from 'mysql';
import cors from 'cors'
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cors({
     origin:["http://localhost:3000"],
     methods: ["POST","GET","PUT","DELETE"],   
     credentials: true
}));
app.use(cookieParser());

const tokenData = {
    userId: '123',
  };
const secretKey = 'yourSecretKey';



const dbproject = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database: 'db_project'
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});



const verifyUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not okay" });
            } else {
                // Ensure 'name' is set correctly
                req.name = decoded.name;
                next();
            }
        });
    }
}

app.post('/Createcomp', (req, res) => {
    const { Cid, Cname, VCode, SWaste, Em_Total, Tax, Date_Joined, SWasteDisposed, Area, Company_Key,Last_Month_Check,Prev_Method_Installed,CO2,NO2,CO,NO } = req.body;

    // Check if the Cid already exists
    const checkCidSql = "SELECT COUNT(*) AS count FROM companies WHERE Cid = ?";
    const checkCidValues = [Cid];

    dbproject.query(checkCidSql, checkCidValues, function (err, checkCidResult) {
        if (err) {
            console.error("Error checking if Cid exists:", err);
            return res.json({ Error: "Error checking if Cid exists", details: err });
        }

        const cidExists = checkCidResult[0].count > 0;

        if (cidExists) {
            // Cid already exists, send an error response
            return res.json({ Error: "Company with the given Cid already exists" });
        }

        // Begin the transaction
        dbproject.beginTransaction(function (err) {
            if (err) {
                console.error("Error beginning transaction:", err);
                return res.json({ Error: "Error beginning transaction", details: err });
            }

            // Insert into violation_table
            const violationSql = "INSERT INTO violation_table (Vcode, Violation_Flag, NoofViolation_E, Comment_E, Comment_W) VALUES (?, ?, ?, ?, ?)";
            const violationValues = [VCode, "NULL", "NULL", "NULL", "NULL"];

            dbproject.query(violationSql, violationValues, function (err, violationResult) {
                if (err) {
                    // Rollback the transaction if there's an error
                    dbproject.rollback(function () {
                        console.error("Error inserting into violation_table:", err);
                        return res.json({ Error: "Error inserting into violation_table", details: err });
                    });
                }

                // Insert into companies table
                const companySql = "INSERT INTO companies (Cid, Cname, VCode, SWaste_Total, Em_Total, Tax, Date_Joined, SWaste_Disposed, Area, Company_Key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const companyValues = [Cid, Cname, VCode, SWaste, Em_Total, Tax, Date_Joined, SWasteDisposed, Area, Company_Key];

                dbproject.query(companySql, companyValues, function (err, companyResult) {
                    if (err) {
                        // Rollback the transaction if there's an error
                        dbproject.rollback(function () {
                            console.error("Error inserting into companies table:", err);
                            return res.json({ Error: "Error inserting into companies table", details: err });
                        });
                    }
                    const emissionSql = "INSERT INTO emission_log (Cid, CO2, NO2, CO, NO, Last_Month_Check, Prev_Method_Installed) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    const emissionValues = [Cid, CO2, NO2, CO, NO, Last_Month_Check,Prev_Method_Installed];

                    dbproject.query(emissionSql, emissionValues, function (err, emissionresult) {
                        if (err) {
                            // Rollback the transaction if there's an error
                            dbproject.rollback(function () {
                                console.error("Error inserting into companies table:", err);
                                return res.json({ Error: "Error inserting into companies table", details: err });
                            });
                        }

                        
                        // Commit the transaction if both queries were successful
                        dbproject.commit(function (err) {
                            if (err) {
                                // Rollback the transaction if there's an error during commit
                                dbproject.rollback(function () {
                                    console.error("Error committing transaction:", err);
                                    return res.json({ Error: "Error committing transaction", details: err });
                                });
                            }

                            // Both queries were successful, send a success response
                            return res.json({ Status: "Success", violationResult, companyResult, emissionresult });
                        });
                    });
                });
            });
        });
    });
});

app.put('/CompanyEdit', (req, res) => {
    const { Company_Key, SWaste_Total, Em_Total, SWaste_Disposed, Area, Last_Month_Check, Prev_Method_Installed, CO2, NO2, CO, NO } = req.body;

    // Fetch the Cid associated with the given Company_Key
    const getCidSql = 'SELECT Cid FROM companies WHERE Company_Key = ?';
    dbproject.query(getCidSql, [Company_Key], (getCidError, getCidResults) => {
        if (getCidError) {
            console.error('Error fetching Cid:', getCidError);
            return res.json(getCidError);
        }

        const Cid = getCidResults[0]?.Cid || ''; // Extract Cid from results

        // Update companies table
        const setCompanyClause = 'SWaste_Total = ?, Em_Total = ?, SWaste_Disposed = ?, Area = ?, Status = "P"';
        const companyValues = [SWaste_Total, Em_Total, SWaste_Disposed, Area, Company_Key];
        const updateCompanySql = `UPDATE companies SET ${setCompanyClause} WHERE Company_Key = ?`;

        dbproject.query(updateCompanySql, companyValues, (companyError, companyResults) => {
            if (companyError) {
                console.error('Error updating companies table:', companyError);
                return res.json(companyError);
            }

            // Update emission_log table
            const setEmissionClause = 'Last_Month_Check = ?, Prev_Method_Installed = ?, CO2 = ?, NO2 = ?, CO = ?, NO = ?';
            const emissionValues = [Last_Month_Check, Prev_Method_Installed, CO2, NO2, CO, NO, Cid];
            const updateEmissionSql = `
                UPDATE emission_log
                SET ${setEmissionClause}
                WHERE Cid = ?;
            `;

            dbproject.query(updateEmissionSql, emissionValues, (emissionError, emissionResults) => {
                if (emissionError) {
                    console.error('Error updating emission_log table:', emissionError);
                    return res.json(emissionError);
                }

                // Send a success response
                return res.json({ Status: 'Success', companyResults, emissionResults });
            });
        });
    });
});




 

app.put('/update', (req, res) => {
     // Use Cid as the primary key
    const { 
        Cid,
        Cname, 
        SWaste_Total, 
        Em_Total, 
        Tax, 
        Eflag, 
        wflag, 
        Date_Joined, 
        SWaste_Disposed, 
        Area, 
        Company_Key,
        Last_Month_Check,
        Prev_Method_Installed,
        CO2,
        NO2,
        CO,
        NO
    } = req.body;

    // Create an object to store non-empty values
    const updateFields = {};
    if (Cname !== '') updateFields.Cname = Cname;
    if (SWaste_Total !== '') updateFields.SWaste_Total = SWaste_Total;
    if (Em_Total !== '') updateFields.Em_Total = Em_Total;
    if (Tax !== '') updateFields.Tax = Tax;
    if (Eflag !== '') updateFields.EFlag = Eflag;
    if (wflag !== '') updateFields.WFlag = wflag;
    if (Date_Joined !== '') updateFields.Date_Joined = Date_Joined;
    if (SWaste_Disposed !== '') updateFields.SWaste_Disposed = SWaste_Disposed;
    if (Area !== '') updateFields.Area = Area;
    if (Company_Key !== '') updateFields.Company_Key = Company_Key;

    // If no fields are provided for the companies table, set the status to 'A'
    if (Object.keys(updateFields).length === 0) {
        updateFields.Status = 'A';
    }

    // Construct the SET clause dynamically
    const setClause = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');

    const sql = `UPDATE companies SET ${setClause} WHERE Cid = ?`;
    const companyValues = [...Object.values(updateFields), Cid];

    const emissionFields = {};
    if (Last_Month_Check !== '') emissionFields.Last_Month_Check = Last_Month_Check;
    if (Prev_Method_Installed !== '') emissionFields.Prev_Method_Installed = Prev_Method_Installed;
    if (CO2 !== '') emissionFields.CO2 = CO2;
    if (NO2 !== '') emissionFields.NO2 = NO2;
    if (CO !== '') emissionFields.CO = CO;
    if (NO !== '') emissionFields.NO = NO;

    // If no fields are provided for the emission_log table, return an error or handle it accordingly
    if (Object.keys(emissionFields).length === 0) {

    }

    // Construct the SET clause dynamically for emission_log
    const emsetClause = Object.keys(emissionFields).map(key => `${key} = ?`).join(', ');
    const emValues = [...Object.values(emissionFields), Cid];
    const emissionql = `UPDATE emission_log SET ${emsetClause} WHERE Cid = ?`;

    // Execute the companies table update query
    dbproject.query(sql, companyValues, (err, companyData) => {
        if (err) {
            return res.json(err);
        }

        // Execute the emission_log table update query
        dbproject.query(emissionql, emValues, (err, emissionData) => {
            if (err) {
                return res.json(err);
            }

            // Send a success response
            return res.json({ Status: 'Success', companyData, emissionData });
        });
    });
});



 
app.delete('/delete/:id', (req, res) => {
    const deleteSql = "DELETE FROM companies WHERE Cid = ?";
    const deleteEmissionsLogSql = "DELETE FROM emission_log WHERE Cid = ?";
    const deleteTaxSql = "DELETE FROM tax WHERE Cid = ?";

    const id = req.params.id;

// Update the rejection_count and status

    // Check if rejection_count is greater than 2
    dbproject.query("SELECT rejection_count FROM companies WHERE Cid = ?", [id], (err, result) => {
        if (err) {
            return res.json(err);
        }

        const rejectionCount = result[0].rejection_count;

       
            // If rejection_count is greater than 2, delete entries in related tables
            dbproject.query(deleteEmissionsLogSql, [id], (err, deleteEmissionsLogResult) => {
                if (err) {
                    return res.json(err);
                }

                dbproject.query(deleteTaxSql, [id], (err, deleteTaxResult) => {
                    if (err) {
                        return res.json(err);
                    }

                    // Delete entry in violation_table
                    const deleteViolationTableSql = "DELETE FROM violation_table WHERE vcode IN (SELECT vcode FROM companies WHERE Cid = ?)";
                    dbproject.query(deleteViolationTableSql, [id], (err, deleteViolationTableResult) => {
                        if (err) {
                            return res.json(err);
                        }

                        // After deleting related entries, delete the entry in the main table
                        dbproject.query(deleteSql, [id], (err, deleteResult) => {
                            if (err) {
                                return res.json(err);
                            }

                            return res.json(deleteResult);
                        });
                    });
                });
            });
       
    });

});

    
    
    


app.delete('/reject/:id', (req, res) => {
    const updateSql = "UPDATE companies SET status = 'R', rejection_count = rejection_count + 1 WHERE Cid = ? AND (status = 'P' OR status = 'R')";
    const deleteSql = "DELETE FROM companies WHERE Cid = ?";
    const deleteEmissionsLogSql = "DELETE FROM emission_log WHERE Cid = ?";
    const deleteTaxSql = "DELETE FROM tax WHERE Cid = ?";

    const id = req.params.id;

// Update the rejection_count and status
dbproject.query(updateSql, [id], (err, data) => {
    if (err) {
        return res.json(err);
    }

    // Check if rejection_count is greater than 2
    dbproject.query("SELECT rejection_count FROM companies WHERE Cid = ?", [id], (err, result) => {
        if (err) {
            return res.json(err);
        }

        const rejectionCount = result[0].rejection_count;

        if (rejectionCount > 2) {
            // If rejection_count is greater than 2, delete entries in related tables
            dbproject.query(deleteEmissionsLogSql, [id], (err, deleteEmissionsLogResult) => {
                if (err) {
                    return res.json(err);
                }

                dbproject.query(deleteTaxSql, [id], (err, deleteTaxResult) => {
                    if (err) {
                        return res.json(err);
                    }

                    // Delete entry in violation_table
                    const deleteViolationTableSql = "DELETE FROM violation_table WHERE vcode IN (SELECT vcode FROM companies WHERE Cid = ?)";
                    dbproject.query(deleteViolationTableSql, [id], (err, deleteViolationTableResult) => {
                        if (err) {
                            return res.json(err);
                        }

                        // After deleting related entries, delete the entry in the main table
                        dbproject.query(deleteSql, [id], (err, deleteResult) => {
                            if (err) {
                                return res.json(err);
                            }

                            return res.json(deleteResult);
                        });
                    });
                });
            });
        } else {
            return res.json(data);
        }
    });
});
});






app.put('/approve/:id', (req, res) => {
    const sql = "UPDATE companies SET status = 'A', rejection_count=0  WHERE Cid = ? and status ='P' or status = 'R'";
    const id = req.params.id;

    dbproject.query(sql, [id], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    });
});



app.get('/', verifyUser, (req, res) => {
    const sql = "SELECT * FROM companies WHERE status='A'";
    dbproject.query(sql, (err, data) => {
        if (err) return res.json({ Error: "Error fetching data" });
        return res.json({ Status: "Success", name: req.name, companies: data });
    });
});


app.get('/deletionlog', (req, res) => {
    const sql = "SELECT *  FROM Deletion_log ";

    dbproject.query(sql, (err, data) => {
        if (err) return res.json({ Error: "Error fetching data" });
        return res.json({ Status: "Success", companies: data });
    });
});



app.get('/goodpublicpage', (req, res) => {
    const sql = `
    SELECT c.*, t.Emissions_Tax, t.Undocumented_Disposal_Tax
    FROM companies c
    LEFT JOIN Tax t ON c.Cid = t.Cid
    WHERE c.status = 'A' AND t.Emissions_Tax = 0 AND t.Undocumented_Disposal_Tax = 0
    `;
    
    dbproject.query(sql, (err, data) => {
    if (err) return res.json({ Error: "Error fetching data" });
    return res.json({ Status: "Success", companies: data });
    });
});

app.get('/badpublicpage', (req, res) => {
    const sql = "SELECT c.*, t.Emissions_Tax, t.Undocumented_Disposal_Tax FROM companies c LEFT JOIN Tax t ON c.Cid = t.Cid WHERE c.status = 'A' AND t.Emissions_Tax > 0 AND t.Undocumented_Disposal_Tax > 0";
    dbproject.query(sql, (err, data) => {
        if (err) return res.json({ Error: "Error fetching data" });
        return res.json({ Status: "Success", companies: data });
    });
});


app.get('/emissionpage/:cid', verifyUser, (req, res) => {
    const { cid } = req.params;
    const sql = `SELECT * FROM emission_log WHERE Cid = ${cid}`;
    
    dbproject.query(sql, (err, data) => {
      if (err) return res.json({ Error: "Error fetching data" });
      return res.json({ Status: "Success", name: req.name, emission: data });
    });
  });

app.get('/Tax/:cid', verifyUser, (req, res) => {
    const { cid } = req.params;
    const sql = `SELECT * FROM Tax WHERE Cid = ${cid}`;
    
    dbproject.query(sql, (err, data) => {
      if (err) return res.json({ Error: "Error fetching data" });
      return res.json({ Status: "Success", name: req.name, emission: data });
    });
  });


  

  app.get('/publicemissionpage/:cid', verifyUser, (req, res) => {
    const { cid } = req.params;
    const sql = `SELECT * FROM emission_log WHERE Cid = ${cid}`;
    
    dbproject.query(sql, (err, data) => {
      if (err) return res.json({ Error: "Error fetching data" });
      return res.json({ Status: "Success", name: req.name, emission: data });
    });
  });  
 

app.get('/ApproveSection', verifyUser, (req, res) => {
    const sql = "SELECT * FROM companies WHERE status='P' OR status='R'";
    dbproject.query(sql, (err, data) => {
        if (err) return res.json({ Error: "Error fetching data" });
        return res.json({ Status: "Success", name: req.name, companies: data });
    });
});




app.post('/userlogin', (req,res)=>{
    const sql = "Select * from userlogin where username = ? and password = ?";
   
    dbproject.query(sql,[req.body.email,req.body.password], (err,data) => {
        if(err) return res.json({Error:"Login error in server"});
        if(data.length > 0){
            const name = data[0].name;
            const token = jwt.sign(tokenData, secretKey, { expiresIn: '1d' });
            res.cookie('token',token);
            return res.json({Status:"Success"});
        }
        else{
            return res.json({Error:"No Record"})
        }
 
    })
})


app.post('/CompanyLogin', (req,res)=>{
    const sql = "Select * from companies where Company_Key=?";
   
    dbproject.query(sql,[req.body.Company_Key], (err,data) => {
        if(err) return res.json({Error:"Login error in server"});
        if(data.length > 0){
            const name = data[0].name;
            
            return res.json({Status:"Success"});
        }
        else{
            return res.json({Error:"No Record"})
        }
 
    })
})

app.get('/',(req,res) => {
    res.send("Welcome to EcoManage");
});

app.listen(4000, ()=>{
    console.log("listening...")
});